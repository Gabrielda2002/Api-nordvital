import { PpsActionLine } from "../entities/pps-action-line";
import { PpsGoal } from "../entities/pps-goal";
import { buildCatalogHandlers } from "../utils/pps-catalog.factory";

const handlers = buildCatalogHandlers({
    entity: PpsGoal,
    singularLabel: "la meta",
    pluralLabel: "metas",
    parent: {
        field: "actionLineId",
        entity: PpsActionLine,
        singularLabel: "la línea de acción",
    },
    relations: { actionLineRelation: true },
    order: { actionLineId: "ASC", code: "ASC" },
});

export const getGoals = handlers.list;
export const createGoal = handlers.create;
export const updateGoal = handlers.update;
export const disableGoal = handlers.disable;
