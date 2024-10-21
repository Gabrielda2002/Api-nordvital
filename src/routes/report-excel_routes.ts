import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { downloadReportExcel, downloadReportExcelFilter } from "../controllers/report-excel_controller";

const router = Router();

router.get('/report-excel', authenticate, authorizeRoles(['1', '3', '6', '2', '14', '3', '15', ]) , downloadReportExcel)

router.post('/report-excel-filtro', authenticate, authorizeRoles(['1', '3', '6', '14', '3', '15', ]) , downloadReportExcelFilter)

export default router;