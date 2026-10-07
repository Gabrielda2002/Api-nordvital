import { BadRequestError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { PpsPeriod } from "../entities/pps-period";
import { PpsProgrammedActivity } from "../entities/pps-programmed-activity";
import { PpsReportingEntity } from "../entities/pps-reporting-entity";
import { cleanMonitoringText, validateMonitoringCompleteness } from "./monitoring.service";

const SEPARATOR = "|";
const LINE_BREAK = "\r\n";

interface GeneratedFile {
    filename: string;
    content: string;
}

const getReportingEntityOrFail = async (): Promise<PpsReportingEntity> => {
    const [entity] = await PpsReportingEntity.find({ order: { id: "ASC" }, take: 1 });

    if (!entity || !entity.identificationNumber) {
        throw new BadRequestError("Configure los datos de la entidad (identificación) antes de generar el archivo");
    }

    return entity;
};

const compactDate = (value: unknown): string => String(value ?? "").replace(/-/g, "");

const paddedIdentification = (value: string): string => value.replace(/\D/g, "").padStart(12, "0");

const formatAmount = (value: unknown): string => {
    const amount = Number(value);

    return Number.isNaN(amount) ? "" : String(amount);
};

const formatInteger = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "";

    return String(value);
};

const buildFilename = (prefix: string, date: unknown, entity: PpsReportingEntity): string =>
    `${prefix}${compactDate(date)}${entity.identificationType}${paddedIdentification(entity.identificationNumber)}.txt`;

const assertActivityExportable = async (activity: PpsProgrammedActivity, index: number): Promise<void> => {
    const clone = PpsProgrammedActivity.create();
    const resources =
        activity.programmedResources === null || activity.programmedResources === undefined
            ? activity.programmedResources
            : Number(activity.programmedResources);

    Object.assign(clone, activity, { programmedResources: resources });

    try {
        await validateEntity(clone);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new BadRequestError(`La actividad #${index + 1} tiene datos inválidos: ${message}`);
    }
};

export async function buildProgrammingFile(period: PpsPeriod): Promise<GeneratedFile> {
    const entity = await getReportingEntityOrFail();

    const activities = await PpsProgrammedActivity.find({
        where: { periodId: period.id },
        relations: { targetPopulationRelation: true },
        order: { id: "ASC" },
    });

    if (!activities.length) {
        throw new BadRequestError("La vigencia no tiene actividades programadas");
    }

    const lines: string[] = [];

    lines.push(
        [
            "1",
            entity.identificationType,
            entity.identificationNumber,
            String(period.startDate),
            String(period.endDate),
            String(activities.length),
        ].join(SEPARATOR)
    );

    for (const [index, activity] of activities.entries()) {
        await assertActivityExportable(activity, index);

        lines.push(
            [
                "2",
                String(index + 1),
                activity.territoryCode,
                activity.actionLineCode,
                activity.goalCode,
                activity.goalDescription,
                activity.activityCode,
                activity.activityDescription,
                String(activity.numericExpression),
                activity.targetPopulationRelation?.code ?? "",
                String(activity.startDate),
                String(activity.endDate),
                formatAmount(activity.programmedResources),
            ].join(SEPARATOR)
        );
    }

    return {
        filename: buildFilename(entity.programmingFilePrefix, period.endDate, entity),
        content: lines.join(LINE_BREAK),
    };
}

export async function buildMonitoringFile(period: PpsPeriod, force: boolean): Promise<GeneratedFile> {
    const entity = await getReportingEntityOrFail();

    const activities = await PpsProgrammedActivity.find({
        where: { periodId: period.id },
        relations: {
            targetPopulationRelation: true,
            monitoringRelation: {
                intervenedPopulationRelation: true,
                fundingSourceRelation: true,
            },
        },
        order: { id: "ASC" },
    });

    if (!activities.length) {
        throw new BadRequestError("La vigencia no tiene actividades programadas");
    }

    const pending: string[] = [];

    activities.forEach((activity, index) => {
        const missing = validateMonitoringCompleteness(activity, activity.monitoringRelation ?? null);

        if (missing.length) {
            pending.push(`#${index + 1} (${missing.join(", ")})`);
        }
    });

    if (pending.length && !force) {
        throw new BadRequestError(
            `Hay ${pending.length} actividad(es) con seguimiento incompleto: ${pending.join("; ")}. Use force=true para generar de todos modos`
        );
    }

    const lines: string[] = [];

    lines.push(
        [
            "1",
            entity.identificationType,
            entity.identificationNumber,
            String(period.startDate),
            String(period.endDate),
            String(activities.length),
        ].join(SEPARATOR)
    );

    for (const [index, activity] of activities.entries()) {
        const monitoring = activity.monitoringRelation;
        const intervenedPopulationCode =
            monitoring?.intervenedPopulationRelation?.code ?? activity.targetPopulationRelation?.code ?? "";
        const executedResources =
            monitoring?.executedResources === null || monitoring?.executedResources === undefined
                ? ""
                : formatAmount(monitoring.executedResources);

        lines.push(
            [
                "2",
                String(index + 1),
                activity.territoryCode,
                activity.actionLineCode,
                activity.goalCode,
                activity.activityCode,
                formatInteger(monitoring?.result),
                intervenedPopulationCode,
                formatInteger(monitoring?.totalPersons),
                executedResources,
                monitoring?.fundingSourceRelation?.code ?? "",
                cleanMonitoringText(monitoring?.evidenceLink),
                cleanMonitoringText(monitoring?.verificationMeans),
            ].join(SEPARATOR)
        );
    }

    const cutoffDate = period.cutoffDate ?? period.endDate;

    return {
        filename: buildFilename(entity.monitoringFilePrefix, cutoffDate, entity),
        content: lines.join(LINE_BREAK),
    };
}
