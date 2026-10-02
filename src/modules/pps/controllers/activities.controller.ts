import { PpsGoal } from "../entities/pps-goal";
import { PpsActivity } from "../entities/pps-activity";
import { buildCatalogHandlers } from "../utils/pps-catalog.factory";

const handlers = buildCatalogHandlers({
    entity: PpsActivity,
    singularLabel: "la actividad",
    pluralLabel: "actividades",
    parent: {
        field: "goalId",
        entity: PpsGoal,
        singularLabel: "la meta",
    },
    relations: { goalRelation: { actionLineRelation: true } },
    order: { goalId: "ASC", code: "ASC" },
});

export const getActivities = handlers.list;
export const createActivity = handlers.create;
export const updateActivity = handlers.update;
export const disableActivity = handlers.disable;
