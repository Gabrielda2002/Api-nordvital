import { PpsTargetPopulation } from "../entities/pps-target-population";
import { buildCatalogHandlers } from "../utils/pps-catalog.factory";

const handlers = buildCatalogHandlers({
    entity: PpsTargetPopulation,
    singularLabel: "la población objetivo",
    pluralLabel: "poblaciones objetivo",
    order: { code: "ASC" },
});

export const getTargetPopulations = handlers.list;
export const createTargetPopulation = handlers.create;
export const updateTargetPopulation = handlers.update;
export const disableTargetPopulation = handlers.disable;
