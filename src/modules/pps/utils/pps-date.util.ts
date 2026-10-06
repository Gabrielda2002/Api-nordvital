import { BadRequestError } from "@core/utils/custom-errors";

export const PPS_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parsePpsDate = (value: unknown, label: string): Date => {
    const text = String(value ?? "").trim();

    if (!PPS_DATE_PATTERN.test(text)) {
        throw new BadRequestError(`La ${label} no es válida; use el formato AAAA-MM-DD`);
    }

    const [year, month, day] = text.split("-").map(Number);
    const check = new Date(Date.UTC(year, month - 1, day));

    if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
        throw new BadRequestError(`La ${label} no es una fecha válida`);
    }

    return text as unknown as Date;
};
