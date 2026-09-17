import { Router } from "express";
import { ALL_REPORTS } from "../registry/all-reports";
import { registerExcelReport } from "../core/report-registry";

const router = Router();

ALL_REPORTS.forEach((d) => registerExcelReport(router, d));

export default router;