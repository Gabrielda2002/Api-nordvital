import type { ReportDescriptor } from "./types";

const EXCEL_MIME =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const PREVIEW_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        total: { type: "integer" },
        data: { type: "array", items: { type: "object" } },
    },
};

const EXCEL_RESPONSE_SCHEMA = { type: "string", format: "binary" };

/**
 * Construye los paths OpenAPI 3.0 de todos los reportes del registry.
 * El path, el tag y los mensajes 404 se derivan del descriptor; solo
 * `swagger.summary` y `swagger.filters` son aporte manual.
 */
export function buildSwaggerPaths(
    reports: ReportDescriptor<any>[]
): Record<string, object> {
    const paths: Record<string, object> = {};

    for (const d of reports) {
        const base = d.basePath ?? `/report/excel/${d.name}`;
        const tag = d.swaggerTag ?? "Reportes Excel";
        const bodySchema = {
            type: "object",
            properties: d.swagger?.filters ?? {},
        };
        const requestBody = {
            required: false,
            content: { "application/json": { schema: bodySchema } },
        };

        paths[`${base}/preview`] = {
            post: {
                summary:
                    d.swagger?.previewSummary ??
                    `Vista previa JSON del reporte ${d.name}`,
                tags: [tag],
                security: [{ bearerAuth: [] }],
                requestBody,
                responses: {
                    200: {
                        description: "Filas del reporte y total",
                        content: {
                            "application/json": { schema: PREVIEW_RESPONSE_SCHEMA },
                        },
                    },
                    401: { description: "No autorizado" },
                },
            },
        };

        paths[base] = {
            post: {
                summary: d.swagger?.summary ?? `Descarga reporte ${d.name} en Excel`,
                tags: [tag],
                security: [{ bearerAuth: [] }],
                requestBody,
                responses: {
                    200: {
                        description: "Archivo Excel generado exitosamente",
                        content: { [EXCEL_MIME]: { schema: EXCEL_RESPONSE_SCHEMA } },
                    },
                    400: { description: "Parámetros inválidos" },
                    401: { description: "No autorizado" },
                    500: { description: "Error del servidor" },
                },
            },
        };
    }

    return paths;
}
