import { PpsActionLine } from "../entities/pps-action-line";
import { buildCatalogHandlers } from "../utils/pps-catalog.factory";

const handlers = buildCatalogHandlers({
    entity: PpsActionLine,
    singularLabel: "la línea de acción",
    pluralLabel: "líneas de acción",
    order: { code: "ASC" },
    derive: (line) => {
        line.strategicAxis = String(line.code).slice(0, 2);
    },
});

export const getActionLines = handlers.list;
export const createActionLine = handlers.create;
export const updateActionLine = handlers.update;
export const disableActionLine = handlers.disable;
