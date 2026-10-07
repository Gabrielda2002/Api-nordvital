import { Router } from "express";
import actionLinesRoutes from "./action-lines.routes";
import goalsRoutes from "./goals.routes";
import activitiesRoutes from "./activities.routes";
import targetPopulationsRoutes from "./target-populations.routes";
import fundingSourcesRoutes from "./funding-sources.routes";
import reportingEntityRoutes from "./reporting-entity.routes";
import periodsRoutes from "./periods.routes";
import programmedActivitiesRoutes from "./programmed-activities.routes";
import monitoringRoutes from "./monitoring.routes";
import ppsFilesRoutes from "./pps-files.routes";

const router = Router();

router.use(actionLinesRoutes);
router.use(goalsRoutes);
router.use(activitiesRoutes);
router.use(targetPopulationsRoutes);
router.use(fundingSourcesRoutes);
router.use(reportingEntityRoutes);
router.use(periodsRoutes);
router.use(programmedActivitiesRoutes);
router.use(monitoringRoutes);
router.use(ppsFilesRoutes);

export default router;
