import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { FileTokenService } from "../services/file-token.service";
import { ROLE_IDS } from "@core/constants/roles";

describe("Document Access - FileTokenService validation", () => {
    describe("isPdfDocument", () => {
        test("debe detectar PDF por mimeType application/pdf", () => {
            const file = { mimeType: "application/pdf", name: "archivo" };
            assert.equal(FileTokenService.isPdfDocument(file), true);
        });

        test("debe detectar PDF con mayúsculas en mimeType o extensión", () => {
            const file = { mimeType: "APPLICATION/PDF", name: "DOCUMENTO.PDF" };
            assert.equal(FileTokenService.isPdfDocument(file), true);
        });

        test("debe detectar PDF por extensión aunque el mimeType sea genérico", () => {
            const file = { mimeType: "application/octet-stream", name: "contrato.pdf" };
            assert.equal(FileTokenService.isPdfDocument(file), true);
        });

        test("debe detectar PDF por mimeType aunque no tenga extensión", () => {
            const file = { mimeType: "application/pdf", name: "documento_sin_extension" };
            assert.equal(FileTokenService.isPdfDocument(file), true);
        });

        test("no debe marcar como PDF un archivo de imagen o docx", () => {
            const docx = { mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", name: "guia.docx" };
            const png = { mimeType: "image/png", name: "foto.png" };
            assert.equal(FileTokenService.isPdfDocument(docx), false);
            assert.equal(FileTokenService.isPdfDocument(png), false);
        });
    });

    describe("canDownloadDocument", () => {
        const pdfFile = { mimeType: "application/pdf", name: "politica.pdf" };
        const wordFile = { mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", name: "formato.docx" };

        test("Administrador (rol 1 string o number) PUEDE descargar PDF", () => {
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, ROLE_IDS.ADMINISTRADOR), true);
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, 1), true);
        });

        test("Calidad (rol 4 string o number) PUEDE descargar PDF", () => {
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, ROLE_IDS.CALIDAD), true);
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, 4), true);
        });

        test("Otros roles (Auxiliar, Médico, Auditor) NO PUEDEN descargar PDF", () => {
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, ROLE_IDS.AUXILIAR), false);
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, ROLE_IDS.MEDICO), false);
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, ROLE_IDS.AUDITOR), false);
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, "99"), false);
            assert.equal(FileTokenService.canDownloadDocument(pdfFile, undefined), false);
        });

        test("Cualquier rol PUEDE descargar archivos no-PDF (Word, Excel, etc.)", () => {
            assert.equal(FileTokenService.canDownloadDocument(wordFile, ROLE_IDS.AUXILIAR), true);
            assert.equal(FileTokenService.canDownloadDocument(wordFile, ROLE_IDS.MEDICO), true);
            assert.equal(FileTokenService.canDownloadDocument(wordFile, ROLE_IDS.AUDITOR), true);
        });
    });
});

