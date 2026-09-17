import type { ReportDescriptor } from "../core/types";
import { pqrsdfReport } from "@modules/pqrsdf/descriptors/report-pqrsdf.descriptor";
import { satisfactionReport } from "@modules/surveys/descriptors/report-satisfaction.descriptor";

export const ALL_REPORTS: ReportDescriptor<any>[] = [
    pqrsdfReport,
    satisfactionReport,
];
