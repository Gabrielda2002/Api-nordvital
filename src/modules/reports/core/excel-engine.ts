import type { Worksheet } from "exceljs";
import type { ReportDescriptor, ReportRow } from "./types";
import type { Response } from "express";
import { applyHeaderStyle, setSolidFill } from "./styles";
import ExcelJS from 'exceljs'
import { randomBytes } from "node:crypto";

export function renderSheet(sheet: Worksheet, rows: ReportRow[], d: ReportDescriptor<any>): void {
    sheet.columns = d.columns.map(c => ({ key: c.key, width: c.width ?? 20 }));

    let dataStartRow: number;

    if (d.header.kind === 'simple') {
        const headerRow = d.header.startRow ?? 1;
        dataStartRow = headerRow + 1;

        d.columns.forEach((c, i) => {
            const cell = sheet.getCell(headerRow, i + 1);
            cell.value = c.label ?? "";
            applyHeaderStyle(cell, d.header.style, d.header.fontSize);
        });

        if (d.header.rowHeight) sheet.getRow(headerRow).height = d.header.rowHeight;
    } else {
        const groupRows = d.header.groupRows ?? 2;

        d.header.groups.forEach((g) => {
            const fromCol = sheet.getColumn(g.from).number;
            const toCol = sheet.getColumn(g.to).number;

            if (!fromCol || !toCol) {
                throw new Error(
                    `Unknown column key in group "${g.label}"`
                );
            }

            sheet.mergeCells(1, fromCol, groupRows, toCol);
            const cell = sheet.getCell(1, fromCol);
            cell.value = g.label;
            applyHeaderStyle(cell, d.header.style, d.header.fontSize);
            if (g.color) setSolidFill(cell, g.color)
        });

        const headerRow = groupRows + 1;
        const labelStyle = d.header.labelStyle ?? d.header.style;
        d.columns.forEach((c, i) => {
            const cell = sheet.getCell(headerRow, i + 1);
            cell.value = c.label ?? "";
            applyHeaderStyle(cell, labelStyle, d.header.fontSize);
        });

        for (let r = 1; r <= groupRows; r++) sheet.getRow(r).height = 25;
        sheet.getRow(headerRow).height = 40;

        dataStartRow = headerRow + 1;
    }

    if (!rows || rows.length === 0) {
        if (!d.onEmpty || d.onEmpty === "empty-sheet") {
            const cell = sheet.getCell(dataStartRow, 1);
            cell.value = 'No hay datos disponibles';
            cell.font = { bold: true };
            cell.alignment =  { horizontal: "center", vertical: "middle"};
        }
        return;
    }

    rows.forEach((r, i) => {
        const sheetRow = sheet.getRow(dataStartRow + i);
        d.columns.forEach((c, ci) => {
            sheetRow.getCell(ci + 1).value = (r[c.key] ?? null) as ExcelJS.CellValue
        });
    });

    if(d.decorate) d.decorate(sheet, rows);

};

export async function sendExcelResponse(res: Response, d: ReportDescriptor<any>, rows: ReportRow[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(d.sheet);

    renderSheet(sheet, rows, d);

    const fileName = `${d.fileBase}_${randomBytes(4).toString('hex')}.xlsx`;

    res.setHeader( "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
};

