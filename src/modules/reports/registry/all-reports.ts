import type { ReportDescriptor } from "../core/types";
import { pqrsdfReport } from "@modules/pqrsdf/descriptors/report-pqrsdf.descriptor";
import { satisfactionReport } from "@modules/surveys/descriptors/report-satisfaction.descriptor";
import { assistantsReport } from "@modules/hr/descriptors/report-assistants.descriptor";
import { breakesActiveReport } from "@modules/hr/descriptors/report-breakes-active.descriptor";
import { biometricReport } from "@modules/hr/descriptors/report-biometric.descriptor";
import { ticketsReport } from "@modules/tickets/descriptors/report-tickets.descriptor";
import { surgerysReport } from "@modules/surgeries/descriptors/report-surgerys.descriptor";
import { radicacionReport } from "@modules/radicacion/descriptors/report-radicacion.descriptor";
import { tvReport } from "@modules/inventory/descriptors/report-tv.descriptor";
import { phonesReport } from "@modules/inventory/descriptors/report-phones.descriptor";
import { generalInventoryReport } from "@modules/inventory/descriptors/report-general-inventory.descriptor";
import { deviceRedReport } from "@modules/inventory/descriptors/report-device-red.descriptor";
import { equipmentsReport } from "@modules/inventory/descriptors/report-equipments.descriptor";
import { demandInducedReport } from "@modules/demand-induced/descriptors/report-demand-induced.descriptor";

export const ALL_REPORTS: ReportDescriptor<any>[] = [
    pqrsdfReport,
    satisfactionReport,
    assistantsReport,
    breakesActiveReport,
    biometricReport,
    ticketsReport,
    surgerysReport,
    radicacionReport,
    tvReport,
    phonesReport,
    generalInventoryReport,
    deviceRedReport,
    equipmentsReport,
    demandInducedReport,
];
