import { AppDataSource } from "@core/db/conexion";
import { BadRequestError } from "@core/utils/custom-errors";
import { PpsActivity } from "../entities/pps-activity";
import { PpsGoal } from "../entities/pps-goal";
import { PpsPeriod } from "../entities/pps-period";
import { PpsReportingEntity } from "../entities/pps-reporting-entity";
import { Sedes } from "../../catalog/entities/sedes";
import { Municipio } from "../../catalog/entities/municipio";
import { parsePpsDate } from "../utils/pps-date.util";

interface CatalogChain {
    actionLineCode: string;
    goalId: number | null;
    goalCode: string;
    goalDescription: string;
    activityId: number | null;
    activityCode: string;
    activityDescription: string;
}

export interface ProgrammedActivityData extends CatalogChain {
    periodId: number;
    headquartersId: number;
    territoryCode: string;
    numericExpression: number;
    targetPopulationId: number;
    startDate: Date;
    endDate: Date;
    programmedResources: number;
}

const normalizeCode = (value: unknown): string => String(value ?? "").trim().toUpperCase();

const parseOptionalId = (value: unknown, label: string): number | null => {
    if (value === undefined || value === null || value === "") return null;

    const id = Number(value);

    if (!Number.isInteger(id)) {
        throw new BadRequestError(`${label} es inválida`);
    }

    return id;
};

const getStrictMode = async (): Promise<boolean> => {
    const [settings] = await PpsReportingEntity.find({ order: { id: "ASC" }, take: 1 });

    return settings?.strictMode ?? true;
};
// ? Resuelve la cadena de catálogo (línea de acción, meta y actividad) a partir de los IDs o códigos proporcionados en el body
const resolveCatalogChain = async (body: any, strictMode: boolean): Promise<CatalogChain> => {
    const activityId = parseOptionalId(body.activityId, "La actividad del catálogo");
    const goalId = parseOptionalId(body.goalId, "La meta del catálogo");

    let activity: PpsActivity | null = null;
    let goal: PpsGoal | null = null;

    if (activityId !== null) {
        activity = await PpsActivity.findOne({
            where: { id: activityId },
            relations: { goalRelation: { actionLineRelation: true } },
        });

        if (!activity) {
            throw new BadRequestError("No se encontró la actividad en el catálogo");
        }

        if (!activity.status) {
            throw new BadRequestError("La actividad del catálogo está desactivada");
        }

        goal = activity.goalRelation;

        if (!goal) {
            throw new BadRequestError("La actividad del catálogo no tiene una meta asociada");
        }

        if (!goal.status) {
            throw new BadRequestError("La meta del catálogo está desactivada");
        }

        if (!goal.actionLineRelation) {
            throw new BadRequestError("La meta del catálogo no tiene una línea de acción asociada");
        }

        if (!goal.actionLineRelation.status) {
            throw new BadRequestError("La línea de acción del catálogo está desactivada");
        }

        if (goalId !== null && goalId !== goal.id) {
            throw new BadRequestError("La actividad seleccionada no pertenece a la meta seleccionada");
        }
    } else if (goalId !== null) {
        goal = await PpsGoal.findOne({
            where: { id: goalId },
            relations: { actionLineRelation: true },
        });

        if (!goal) {
            throw new BadRequestError("No se encontró la meta en el catálogo");
        }

        if (!goal.status) {
            throw new BadRequestError("La meta del catálogo está desactivada");
        }

        if (!goal.actionLineRelation) {
            throw new BadRequestError("La meta del catálogo no tiene una línea de acción asociada");
        }

        if (!goal.actionLineRelation.status) {
            throw new BadRequestError("La línea de acción del catálogo está desactivada");
        }
    }

    if (strictMode && !activity) {
        throw new BadRequestError("El modo estricto exige seleccionar la meta y la actividad del catálogo");
    }

    return {
        actionLineCode: goal ? goal.actionLineRelation.code : normalizeCode(body.actionLineCode),
        goalId: goal?.id ?? null,
        goalCode: goal ? goal.code : normalizeCode(body.goalCode),
        goalDescription: goal ? goal.description : String(body.goalDescription ?? "").trim(),
        activityId: activity?.id ?? null,
        activityCode: activity ? activity.code : normalizeCode(body.activityCode),
        activityDescription: activity ? activity.description : String(body.activityDescription ?? "").trim(),
    };
};
// ? Resuelve el código del territorio a partir de la sede
const resolveTerritoryCode = async (headquarters: Sedes): Promise<string> => {
    const digits = String(headquarters.licenseCode ?? "").replace(/\D/g, "");

    if (digits.length < 5) {
        throw new BadRequestError("La sede no tiene un código de habilitación válido (mínimo 5 dígitos)");
    }

    const territoryCode = digits.slice(0, 5);
    const municipality = await Municipio.findOneBy({ id: headquarters.municipalityId });
    const municipalityCode =
        municipality?.municipalityCode !== null && municipality?.municipalityCode !== undefined
            ? String(municipality.municipalityCode).padStart(5, "0")
            : null;

    if (municipalityCode && municipalityCode !== territoryCode) {
        throw new BadRequestError(
            `El código de habilitación de la sede no corresponde al municipio registrado (esperado ${municipalityCode}, obtenido ${territoryCode})`
        );
    }

    if (!municipalityCode) {
        const exists = await AppDataSource.getRepository(Municipio)
            .createQueryBuilder("municipality")
            .where("LPAD(municipality.municipality_code, 5, '0') = :territoryCode", { territoryCode })
            .getExists();

        if (!exists) {
            throw new BadRequestError(
                `El territorio derivado (${territoryCode}) no es un código Divipola válido; revise el código de habilitación de la sede`
            );
        }
    }

    return territoryCode;
};

export async function buildProgrammedActivityData(body: any, period: PpsPeriod): Promise<ProgrammedActivityData> {
    const headquartersId = Number(body.headquartersId);

    if (!Number.isInteger(headquartersId)) {
        throw new BadRequestError("La sede es requerida");
    }

    const headquarters = await Sedes.findOneBy({ id: headquartersId });

    if (!headquarters) {
        throw new BadRequestError("No se encontró la sede");
    }

    const territoryCode = await resolveTerritoryCode(headquarters);
    const strictMode = await getStrictMode();
    const chain = await resolveCatalogChain(body, strictMode);

    const startDate = parsePpsDate(body.startDate, "fecha de inicio de la actividad");
    const endDate = parsePpsDate(body.endDate, "fecha de fin de la actividad");

    if (String(endDate) < String(startDate)) {
        throw new BadRequestError("La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    if (String(startDate) < String(period.startDate) || String(endDate) > String(period.endDate)) {
        throw new BadRequestError(
            `Las fechas de la actividad deben estar dentro de la vigencia (${String(period.startDate)} a ${String(period.endDate)})`
        );
    }

    return {
        periodId: period.id,
        headquartersId,
        territoryCode,
        ...chain,
        numericExpression: Number(body.numericExpression),
        targetPopulationId: Number(body.targetPopulationId),
        startDate,
        endDate,
        programmedResources: Number(body.programmedResources),
    };
}
