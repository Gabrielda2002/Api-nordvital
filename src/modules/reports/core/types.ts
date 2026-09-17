import type { Worksheet } from "exceljs";
import type { Request } from "express";

export type ReportRow = Record<string, string | number | Date | boolean | null | undefined>;

export type HeaderStylePreset =
    | "primary"
    | "primaryDark"
    | "secondary"
    | "neutral"
    | "success"
    | "plain";

export interface ReportColumn {
    key: string;
    label?: string;
    width?: number;
}

export type HeaderSpec =
    | { kind: "simple"; style?: HeaderStylePreset; rowHeight?: number; fontSize?: number; startRow?: number }
    | {
        kind: "grouped";
        groupRows?: number;
        groups: { label: string; from: string; to: string; color?: string }[];
        style?: HeaderStylePreset;
        labelStyle?: HeaderStylePreset;
        fontSize?: number;
    };

export interface ReportSwaggerMeta {
    summary?: string;
    previewSummary?: string;
    filters?: Record<string, Record<string, unknown>>;
}

export interface ReportDescriptor<F extends object = Record<string, unknown>> {
    name: string;
    roles: readonly (string | number)[];
    sheet: string;
    fileBase: string;
    basePath?: string;
    columns: ReportColumn[];
    header: HeaderSpec;
    fetchRows: (filters: F, limit?: number) => Promise<ReportRow[]>;
    parseFilters?: (body: Record<string, unknown>, req: Request) => F;
    onEmpty?: "empty-sheet" | "throw-404" | "none";
    previewLimit?: number;
    notFoundMessage?: string;
    previewNotFoundMessage?: string;
    decorate?: (sheet: Worksheet, rows: ReportRow[]) => void;
    swagger?: ReportSwaggerMeta;
    swaggerTag?: string;
}
