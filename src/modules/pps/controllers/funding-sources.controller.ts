import { PpsFundingSource } from "../entities/pps-funding-source";
import { buildCatalogHandlers } from "../utils/pps-catalog.factory";

const handlers = buildCatalogHandlers({
    entity: PpsFundingSource,
    singularLabel: "la fuente de recursos",
    pluralLabel: "fuentes de recursos",
    order: { code: "ASC" },
});

export const getFundingSources = handlers.list;
export const createFundingSource = handlers.create;
export const updateFundingSource = handlers.update;
export const disableFundingSource = handlers.disable;
