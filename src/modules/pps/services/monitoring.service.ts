import { PpsMonitoring } from "../entities/pps-monitoring";
import { PpsProgrammedActivity } from "../entities/pps-programmed-activity";

export const cleanMonitoringText = (value: unknown): string =>
    String(value ?? "").replace(/[;,]/g, "").replace(/\s+$/g, "");

export function validateMonitoringCompleteness(
    activity: PpsProgrammedActivity,
    monitoring: PpsMonitoring | null
): string[] {
    const errors: string[] = [];

    if (!monitoring) {
        return ["resultado", "poblacionIntervenida", "totalPersonas", "recursosEjecutados", "fuente", "link", "medioVerificacion"];
    }

    if (monitoring.result === null || monitoring.result === undefined || !(Number(monitoring.result) >= 0)) {
        errors.push("resultado");
    }

    const intervenedPopulationId = monitoring.intervenedPopulationId ?? activity.targetPopulationId;

    if (!intervenedPopulationId) {
        errors.push("poblacionIntervenida");
    }

    if (monitoring.totalPersons === null || monitoring.totalPersons === undefined || !(Number(monitoring.totalPersons) >= 0)) {
        errors.push("totalPersonas");
    }

    if (
        monitoring.executedResources === null ||
        monitoring.executedResources === undefined ||
        Number.isNaN(Number(monitoring.executedResources))
    ) {
        errors.push("recursosEjecutados");
    }

    if (!monitoring.fundingSourceId) {
        errors.push("fuente");
    }

    const link = cleanMonitoringText(monitoring.evidenceLink);

    if (link.length < 20 || /no aplica/i.test(link)) {
        errors.push("link");
    }

    const means = cleanMonitoringText(monitoring.verificationMeans);

    if (means.length < 20 || /no aplica/i.test(means)) {
        errors.push("medioVerificacion");
    }

    return errors;
}
