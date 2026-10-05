import { Router } from "express";
import actionLinesRoutes from "./action-lines.routes";
import goalsRoutes from "./goals.routes";
import activitiesRoutes from "./activities.routes";
import targetPopulationsRoutes from "./target-populations.routes";
import fundingSourcesRoutes from "./funding-sources.routes";
import reportingEntityRoutes from "./reporting-entity.routes";
import periodsRoutes from "./periods.routes";

const router = Router();

router.use(actionLinesRoutes);
router.use(goalsRoutes);
router.use(activitiesRoutes);
router.use(targetPopulationsRoutes);
router.use(fundingSourcesRoutes);
router.use(reportingEntityRoutes);
router.use(periodsRoutes);

export default router;
