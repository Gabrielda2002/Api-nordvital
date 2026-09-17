import { test } from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { renderSheet } from "../excel-engine";
import type { ReportDescriptor, ReportRow } from "../types";

const columns = [
    { key: "name", label: "NOMBRE", width: 20 },
    { key: "value", label: "VALOR", width: 20 },
];

const simpleDescriptor: ReportDescriptor = {
    name: "test-simple",
    roles: [],
    sheet: "Test",
    fileBase: "test_simple",
    columns,
    header: { kind: "simple", style: "primary" },
    fetchRows: async () => [],
};

function buildSheet(d: ReportDescriptor, rows: ReportRow[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(d.sheet);
    renderSheet(sheet, rows, d);
    return sheet;
}

test("simple: header en fila 1 y datos desde fila 2", () => {
    const sheet = buildSheet(simpleDescriptor, [{ name: "Ana", value: 1 }]);
    assert.equal(sheet.getCell(1, 1).value, "NOMBRE");
    assert.equal(sheet.getCell(2, 1).value, "Ana");
    assert.equal(sheet.getCell(2, 2).value, 1);
});

test("grouped: banner combinado, labels en fila 3 y datos desde fila 4", () => {
    const grouped: ReportDescriptor = {
        ...simpleDescriptor,
        name: "test-grouped",
        header: {
            kind: "grouped",
            groupRows: 2,
            style: "primary",
            groups: [{ label: "GRUPO A", from: "name", to: "value", color: "FF335C81" }],
        },
    };
    const sheet = buildSheet(grouped, [{ name: "Ana", value: 1 }]);
    assert.equal(sheet.getCell(1, 1).value, "GRUPO A");
    assert.equal(sheet.getCell(3, 1).value, "NOMBRE");
    assert.equal(sheet.getCell(4, 1).value, "Ana");
});

test("vacio: escribe 'No hay datos disponibles' en dataStartRow", () => {
    const sheet = buildSheet(simpleDescriptor, []);
    assert.equal(sheet.getCell(2, 1).value, "No hay datos disponibles");
});

test("startRow: header en la fila indicada y datos en la siguiente", () => {
    const shifted: ReportDescriptor = {
        ...simpleDescriptor,
        name: "test-shifted",
        header: { kind: "simple", style: "primary", startRow: 3 },
    };
    const sheet = buildSheet(shifted, [{ name: "Ana", value: 1 }]);
    assert.equal(sheet.getCell(1, 1).value, null);
    assert.equal(sheet.getCell(3, 1).value, "NOMBRE");
    assert.equal(sheet.getCell(4, 1).value, "Ana");
});
