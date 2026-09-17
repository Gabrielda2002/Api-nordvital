import type { Cell } from "exceljs";
import type { HeaderStylePreset } from "./types";

type PresetDef = {
    bold: boolean;
    fontArgb: string;
    fillArgb?: string;
    align?: { horizontal: "left" | "center"; vertical: "middle"; wrapText: boolean };
    border?: boolean;
}

const HEADER_PRESETS: Record<HeaderStylePreset, PresetDef> = {
    primary: { bold: true, fontArgb: "FFFFFFFF", fillArgb: "FF335C81", align: { horizontal: "center", vertical: "middle", wrapText: true }, border: true },
    primaryDark: { bold: true, fontArgb: "FFFFFFFF", fillArgb: "FF2F5496", align: { horizontal: "center", vertical: "middle", wrapText: true }, border: true },
    secondary: { bold: true, fontArgb: "FFFFFFFF", fillArgb: "FF46B1C9", align: { horizontal: "center", vertical: "middle", wrapText: true }, border: true },
    neutral: { bold: true, fontArgb: "FF000000", fillArgb: "FFE0E1E9", align: { horizontal: "center", vertical: "middle", wrapText: true }, border: true },
    success: { bold: true, fontArgb: "FF000000", fillArgb: "FF84DCCF", align: { horizontal: "center", vertical: "middle", wrapText: true }, border: true },
    plain: { bold: true, fontArgb: "FF000000" },
}

export function applyHeaderStyle(cell: Cell, preset: HeaderStylePreset = "primary", fontSize?: number): void {
    const p = HEADER_PRESETS[preset] ?? HEADER_PRESETS.primary;

    cell.font = fontSize
        ? { bold: p.bold, color: { argb: p.fontArgb }, size: fontSize }
        : { bold: p.bold, color: { argb: p.fontArgb } };

    if (p.fillArgb) setSolidFill(cell, p.fillArgb);
    if (p.align) cell.alignment = p.align;
    if (p.border) {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    }
}

export function setSolidFill(cell: Cell, argb: string): void {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}
