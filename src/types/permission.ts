// Shared types and enums for the Permission module

export type PermissionCategory = "PERMISO" | "INCAPACIDAD" | "CALAMIDAD" | "VACACIONES";
export type PermissionGranularity = "HOURLY" | "DAILY" | "MULTI_DAY";
export type OverallStatus = "PENDIENTE" | "EN_REVISION" | "APROBADO" | "RECHAZADO" | "CANCELADO";

export type StepType = "JEFE" | "RRHH";
export type StepStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "VISTO";
