import type { Router } from "express";
import type { ReportDescriptor } from "./types";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { buildExportHandler, buildPreviewHandler } from "./handlers";

export function registerExcelReport(
    router: Router,
    d: ReportDescriptor<any>
): void {
    const base = d.basePath ?? `/report/excel/${d.name}`;

    router.post(
        `${base}/preview`,
        authenticate,
        authorizeRoles(d.roles),
        buildPreviewHandler(d)
    );

    router.post(
        base,
        authenticate,
        authorizeRoles(d.roles),
        buildExportHandler(d)
    );
}
