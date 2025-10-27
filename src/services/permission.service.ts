import { Between, DataSource, In, Not } from "typeorm";
import { PermissionRequest } from "../entities/permission-request";
import { PermissionPolicy } from "../entities/permission-policy";
import { PermissionApprovalStep } from "../entities/permission-approval-step";
import { PermissionAttachment } from "../entities/permission-attachment";
import { Usuarios } from "../entities/usuarios";
import { PermissionCategory, PermissionGranularity, StepStatus } from "../types/permission";
import { AppDataSource } from "../db/conexion";

export type CreateAttachmentDto = {
  soporteId: number;
  label: string;
};

export type CreatePermissionRequestDto = {
  category: PermissionCategory;
  granularity: PermissionGranularity;
  requesterId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  nonRemunerated?: boolean;
  compensationTime?: string;
  notes?: string;
  attachments?: CreateAttachmentDto[];
  // If true, the controller guarantees there is a pending file upload to satisfy required-document policies
  deferredAttachment?: boolean;
};

const HOURS_PER_DAY = 8; // Ajustable si tu jornada laboral es diferente

// ? Convertir tiempo a minutos
function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
// ? Date en formato YYYY-MM-DD
function dateOnly(d: string | Date): string {
  const dt = typeof d === "string" ? new Date(d + "T00:00:00") : d;
  return dt.toISOString().slice(0, 10);
}

// ? Diferencia de días entre dos fechas, ambos inclusive
function daysDiffInclusive(start: string, end: string): number {
  const a = new Date(start + "T00:00:00");
  const b = new Date(end + "T00:00:00");
  const diffMs = b.getTime() - a.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // ambos inclusive
}

// ? Calcular días solicitados según granularidad
function computeRequestedDays(input: CreatePermissionRequestDto): number {
  if (input.granularity === "HOURLY") {
    if (!input.startTime || !input.endTime) {
      throw new Error("For HOURLY requests, startTime and endTime are required");
    }

    if (dateOnly(input.startDate) !== dateOnly(input.endDate)) {
      throw new Error("For HOURLY requests, startDate must equal endDate");
    }

    const mins = parseTimeToMinutes(input.endTime) - parseTimeToMinutes(input.startTime);

    if (mins <= 0) throw new Error("endTime must be greater than startTime");

    const hours = mins / 60;

    return +(hours / HOURS_PER_DAY).toFixed(3); // fracción de día
  }
  // DAILY / MULTI_DAY (asumimos días calendario)   
  const totalDays = daysDiffInclusive(input.startDate, input.endDate);
  if (totalDays <= 0) throw new Error("Invalid date range");
  return totalDays;
}

// ? Resolver jefe del solicitante
async function resolveBossUserId(requesterId: number): Promise<number | null> {
  // requester -> cargo -> area -> jefe_area_id
  const user = await Usuarios.createQueryBuilder("u")
    .leftJoinAndSelect("u.cargoRelation", "cargo")
    .leftJoinAndSelect("cargo.areaRelation", "area")
    .where("u.id = :id", { id: requesterId })
    .getOne();
  if (!user) throw new Error("Requester user not found");
  const managerId = user.cargoRelation?.areaRelation?.managerId ?? null;
  return managerId ?? null;
}

// ? Obtener política por categoría
async function getPolicy(category: PermissionCategory): Promise<PermissionPolicy> {
  const policy = await PermissionPolicy.findOne({ where: { category } });
  if (!policy) throw new Error(`Policy not found for category ${category}`);
  return policy;
}

// ? Validar antigüedad si aplica
async function validateTenureIfApplies(category: PermissionCategory, requester: Usuarios, minDays: number) {
  if (category !== "VACACIONES") return; // Solo aplica a Vacaciones
  if (!requester.dateStartContract) {
    throw new Error("Requester has no contract start date");
  }
  const start = new Date(requester.dateStartContract);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < minDays) {
    throw new Error(`Minimum tenure of ${minDays} days required for VACACIONES`);
  }
}

// ? Validar solapamiento
function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return !(aEnd < bStart || bEnd < aStart);
}

// ? Validar solapamiento horario
function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return !(aEnd <= bStart || bEnd <= aStart);
}

// ? Validar solapamiento de fechas
async function validateNoOverlap(ds: DataSource, input: CreatePermissionRequestDto, requesterId: number, category: PermissionCategory) {
  const repo = ds.getRepository(PermissionRequest);
  const candidateDate = dateOnly(input.startDate);
  const candidateEnd = dateOnly(input.endDate);

  const existing = await repo
    .createQueryBuilder("r")
    .where("r.solicitante_id = :requesterId", { requesterId })
    .andWhere("r.categoria = :category", { category })
    .andWhere("r.estado_global IN (:...sts)", { sts: ["PENDIENTE", "EN_REVISION", "APROBADO"] })
    .andWhere("NOT (r.fecha_fin < :start OR r.fecha_inicio > :end)", { start: candidateDate, end: candidateEnd })
    .getMany();

  if (existing.length === 0) return;

  if (input.granularity === "HOURLY") {
    for (const r of existing) {
      if (dateOnly(r.startDate) !== candidateDate) continue; // solo mismo día
      if (!r.startTime || !r.endTime || !input.startTime || !input.endTime) continue;
      if (timesOverlap(input.startTime, input.endTime, r.startTime, r.endTime)) {
        throw new Error("Overlapping hourly request not allowed");
      }
    }
  } else {
    throw new Error("Overlapping date range not allowed");
  }
}
// ? Validar topes
async function validateMaxPerRequest(maxDays: number | null | undefined, requestedDays: number) {
  if (maxDays == null) return;
  if (requestedDays > maxDays) {
    throw new Error(`Exceeds max days per request (${maxDays})`);
  }
}

// ? Validar topes anuales
async function validateMaxPerYear(ds: DataSource, requesterId: number, category: PermissionCategory, year: number, requestedDays: number, maxYear: number | null | undefined) {
  if (maxYear == null) return;
  const repo = ds.getRepository(PermissionRequest);
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;
  const rows = await repo
    .createQueryBuilder("r")
    .select("SUM(r.dias_solicitados)", "sum")
    .where("r.solicitante_id = :requesterId", { requesterId })
    .andWhere("r.categoria = :category", { category })
    .andWhere("r.estado_global IN (:...sts)", { sts: ["PENDIENTE", "EN_REVISION", "APROBADO"] })
    .andWhere("r.fecha_inicio <= :yearEnd AND r.fecha_fin >= :yearStart", { yearStart, yearEnd })
    .getRawOne<{ sum: string | null }>();

  const accumulated = rows?.sum ? parseFloat(rows.sum) : 0;
  if (accumulated + requestedDays > maxYear) {
    throw new Error(`Exceeds max days per year (${maxYear}). Used: ${accumulated}, Requested: ${requestedDays}`);
  }
}

// ? Construir pasos según categoría y jefe asignado
function buildStepsForCategory(category: PermissionCategory, bossUserId: number | null): Array<Pick<PermissionApprovalStep, "order" | "stepType" | "approverRole" | "approverUserId" | "status">> { // ? pick crea un nuevo tipo con solo esas propiedades del tipo original (PermissionApprovalStep)

  const steps: Array<Pick<PermissionApprovalStep, "order" | "stepType" | "approverRole" | "approverUserId" | "status">> = [];

  if (category === "PERMISO") {

    // JEFE -> RRHH (VISTO)
    if (!bossUserId) throw new Error("No manager assigned for requester's area");

    steps.push({ order: 1, stepType: "JEFE", approverRole: null as any, approverUserId: bossUserId, status: "PENDIENTE" });

    steps.push({ order: 2, stepType: "RRHH", approverRole: "RRHH", approverUserId: null as any, status: "PENDIENTE" });

  } else if (category === "INCAPACIDAD") {

    // Solo RRHH (VISTO)
    steps.push({ order: 1, stepType: "RRHH", approverRole: "RRHH", approverUserId: null as any, status: "PENDIENTE" });

  } else if (category === "VACACIONES") {

    // Solo RRHH (APROBAR/RECHAZAR)
    steps.push({ order: 1, stepType: "RRHH", approverRole: "RRHH", approverUserId: null as any, status: "PENDIENTE" });

  } else if (category === "CALAMIDAD") {

    // JEFE -> RRHH (VISTO)
    if (!bossUserId) throw new Error("No manager assigned for requester's area");

    steps.push({ order: 1, stepType: "JEFE", approverRole: null as any, approverUserId: bossUserId, status: "PENDIENTE" });

    steps.push({ order: 2, stepType: "RRHH", approverRole: "RRHH", approverUserId: null as any, status: "PENDIENTE" });

  } else {
    throw new Error("Unsupported category");
  }
  return steps;
}

type Result<T> = | { success: true; data: T } | { success: false; error: string; statusCode: number };

export class PermissionService {
  constructor(private readonly ds: DataSource = AppDataSource) {}

  async createRequest(input: CreatePermissionRequestDto): Promise<Result<PermissionRequest>> {
    return await this.ds.transaction(async (manager) => {
      // Fetch policy
      const policy = await manager.getRepository(PermissionPolicy).findOne({ where: { category: input.category } });

      if (!policy) return { success: false,  error: "No policy defined for this category", statusCode: 400};

      // Validate requester
      const requester = await manager.getRepository(Usuarios).findOne({ where: { id: input.requesterId }, relations: { cargoRelation: { areaRelation: true } } });

      if (!requester) return { success: false, error: "Requester user not found", statusCode: 404 };

      // Dates consistency
      if (dateOnly(input.startDate) > dateOnly(input.endDate)) {
        return { success: false, error: "startDate cannot be after endDate", statusCode: 400 };
      }

      // Compute requested days
      const requestedDays = computeRequestedDays(input);

      // Required attachments
      if (policy.requiresDocument) {
        const hasProvidedAttachments = !!(input.attachments && input.attachments.length > 0);
        const hasDeferred = !!input.deferredAttachment;
        if (!hasProvidedAttachments && !hasDeferred) {
          return { success: false, error: "This request requires supporting documents", statusCode: 400 };
        }
      }

      // Tenure (only vacations per business rule)
      await validateTenureIfApplies(input.category, requester, policy.minTenureDays);

      // Overlap
      if (!policy.allowOverlap) {
        await validateNoOverlap(this.ds, input, input.requesterId, input.category);
      }

      // Max per request / year
      await validateMaxPerRequest(policy.maxDaysPerRequest as any, requestedDays);
      const year = new Date(input.startDate + "T00:00:00").getFullYear();
      await validateMaxPerYear(this.ds, input.requesterId, input.category, year, requestedDays, policy.maxDaysPerYear as any);

      // Build steps
      const bossId = await resolveBossUserId(input.requesterId);
      const steps = buildStepsForCategory(input.category, bossId);

      // Persist request
      const reqRepo = manager.getRepository(PermissionRequest);
      const req = reqRepo.create({
        category: input.category,
        granularity: input.granularity,
        requesterId: input.requesterId,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        startTime: input.startTime ?? null as any,
        endTime: input.endTime ?? null as any,
        requestedDays: requestedDays,
        nonRemunerated: !!input.nonRemunerated,
        compensationTime: input.compensationTime ?? null as any,
        notes: input.notes ?? null as any,
        overallStatus: "PENDIENTE",
      });
      await reqRepo.save(req);

      // Persist steps
      const stepRepo = manager.getRepository(PermissionApprovalStep);
      for (const s of steps) {
        const step = stepRepo.create({
          requestRelation: req,
          order: s.order,
          stepType: s.stepType,
          approverRole: s.approverRole ?? null,
          approverUserId: s.approverUserId ?? null,
          status: s.status,
        } as any);
        await stepRepo.save(step);
      }

      // Persist attachments
      if (input.attachments?.length) {
        const attRepo = manager.getRepository(PermissionAttachment);
        for (const a of input.attachments) {
          const att = attRepo.create({
            requestRelation: req,
            supportId: a.soporteId,
            label: a.label,
            uploadedBy: input.requesterId,
          } as any);
          await attRepo.save(att);
        }
      }

      const createdRequest =await reqRepo.findOne({
        where: { id: req.id },
        relations: { stepsRelation: true, attachmentsRelation: true, requesterRelation: true },
      });

      return { success: true, data: createdRequest! }
    });
  }
// ? Obtener solicitud por ID
  async getRequestById(id: number) {
    return await this.ds.getRepository(PermissionRequest).findOne({
      where: { id },
      relations: { stepsRelation: true, attachmentsRelation: true, requesterRelation: true },
    });
  }

// ? Listar solicitudes por jefe o RRHH
// ? la idea es que RRHH vea todas, y jefes solo las de su área
async listRequestsForUser(userId: number, isHR: boolean) {

  const user = await this.ds.getRepository(Usuarios).findOne({ where: { id: userId }, relations: { cargoRelation: { areaRelation: true } } });
  if (!user) throw new Error("User not found");

  let requests: PermissionRequest[] = [];

  if (isHR) {
    requests = await this.ds.getRepository(PermissionRequest).find({
      relations: { stepsRelation: true, attachmentsRelation: true, requesterRelation: true },
    });
  } else {
    requests = await this.ds.getRepository(PermissionRequest).createQueryBuilder("r")
      .leftJoinAndSelect("r.stepsRelation", "steps")
      .leftJoinAndSelect("steps.approverUserRelation", "approver")
      .leftJoinAndSelect("r.attachmentsRelation", "attachments")
      .leftJoinAndSelect("r.requesterRelation", "requester")
      .where("steps.approverUserId = :userId", { userId })
      .getMany();
  }

  const resultFormatted = requests.map(r => ({
    id: r.id || 'N/A',
    category: r.category || 'N/A',
    granularity: r.granularity || 'N/A',
    requesterId: r.requesterId || 'N/A',
    requesterName: r.requesterRelation ? `${r.requesterRelation.name} ${r.requesterRelation.lastName}` : "N/A",
    startDate: r.startDate || 'N/A',
    endDate: r.endDate || 'N/A',
    startTime: r.startTime || 'N/A',
    endTime: r.endTime || 'N/A',
    requestedDays: r.requestedDays || 'N/A',
    nonRemunerated: r.nonRemunerated,
    compensationTime: r.compensationTime || 'N/A',
    notes: r.notes || 'N/A',
    overallStatus: r.overallStatus || 'N/A',
    createdAt: r.createdAt,
    steps: r.stepsRelation.map(s => ({
      id: s.id || 'N/A',
      order: s.order ||  'N/A',
      stepType: s.stepType || 'N/A',
      approverRole: s.approverRole || 'N/A',
      approverUserId: s.approverUserId || 'N/A',
      approverName: s.approverUserRelation ? `${s.approverUserRelation.name} ${s.approverUserRelation.lastName}` : "N/A",
      status: s.status || 'N/A',
      comment: s.comment || 'N/A',
      createdAt: s.createdAt || 'N/A',
    })),
    attachments: r.attachmentsRelation?.map(a => ({
      id: a.id || 'N/A',
      supportId: a.supportId || 'N/A',
      label: a.label || 'N/A',
      createdAt: a.createdAt || 'N/A',  
    }))
  }))

  return resultFormatted;
}

async listAllRequestsByUser(userId: number) {
  return await this.ds.getRepository(PermissionRequest).find({
    where: { requesterId: userId },
    relations: { stepsRelation: true, attachmentsRelation: true, requesterRelation: true},
  });
}

// ? Actuar sobre un paso (aprobar, rechazar, visto)
  async actOnStep(requestId: number, stepId: number, actorUserId: number, action: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "VISTO", comment?: string) {

    return await this.ds.transaction(async (manager) => {
      const reqRepo = manager.getRepository(PermissionRequest);
      const stepRepo = manager.getRepository(PermissionApprovalStep);

      const req = await reqRepo.findOne({ where: { id: requestId } });

      if (!req) throw new Error("Request not found");

      if (["RECHAZADO", "CANCELADO", "APROBADO"].includes(req.overallStatus)) {
        throw new Error("Request is not actionable in its current state");
      }

      const step = await stepRepo
        .createQueryBuilder("s")
        .leftJoin("s.requestRelation", "r")
        .leftJoinAndSelect("s.approverUserRelation", "approver")
        .where("s.id = :stepId", { stepId })
        .andWhere("r.id = :requestId", { requestId })
        .getOne();

      if (!step) throw new Error("Step not found");
      
      if (step.status !== "PENDIENTE") throw new Error("Step already processed");

      // Authorization: JEFE (user assigned) or RRHH (role based). For now, allow if approverUserId matches or approverRole === 'RRHH'.
      if (step.stepType === "JEFE") {
        if (step.approverUserId !== actorUserId) throw new Error("Not authorized for this step");
      } else if (step.stepType === "RRHH") {
        // TODO: validate actor has RRHH role using Usuarios->Roles
      }

      if (action === "APROBADO") {
        step.status = "APROBADO";
      } else if (action === "RECHAZADO") {
        step.status = "RECHAZADO";
      } else if (action === "VISTO") {
        step.status = "VISTO";
      }
      step.comment = comment ?? null as any;
      step.actedAt = new Date();
      await stepRepo.save(step);

      // Update overall status
      const steps = await stepRepo.find({ where: { requestId } });
      const anyRejected = steps.some((s) => s.status === "RECHAZADO");
      const allDone = steps.every((s) => ["APROBADO", "VISTO"].includes(s.status));
      req.overallStatus = anyRejected ? "RECHAZADO" : allDone ? "APROBADO" : "EN_REVISION";
      await reqRepo.save(req);

      return { request: req, step };
    });
  }
}
