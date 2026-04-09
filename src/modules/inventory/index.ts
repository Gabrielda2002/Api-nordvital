// Inventory Module - Main Barrel Export

// Entities
export * from "./entities";

// Controllers
export * from "./controllers/equipos.controller";
export * from "./controllers/accesorios-equipos.controller";
export * from "./controllers/componentes.controller";
export * from "./controllers/software.controller";
export * from "./controllers/dispositivos-red.controller";
export * from "./controllers/celular.controller";
export * from "./controllers/televisor.controller";
export * from "./controllers/inventario-general.controller";
export * from "./controllers/seguimiento-equipos.controller";
export * from "./controllers/seguimiento-dispositivos-red.controller";
export * from "./controllers/seguimiento-celulares.controller";
export * from "./controllers/seguimiento-televisores.controller";
export * from "./controllers/seguimiento-inventario-general.controller";
export * from "./controllers/maintenance-checklist.controller";
export * from "./controllers/activos.controller";
export * from "./controllers/tipo-activo.controller";
export * from "./controllers/clasificacion.controller";
export * from "./controllers/materiales.controller";
export * from "./controllers/estado-iv-general.controller";

// Services
export * from "./services/report-equipments.service";
export * from "./services/report-general-inventory.service";
export * from "./services/report-phones.service";
export * from "./services/report-red-device.service";
export * from "./services/report-tv.service";

// Routes
export { default as equiposRoutes } from "./routes/equipos.routes";
export { default as accesoriosEquiposRoutes } from "./routes/accesorios-equipos.routes";
export { default as componentesRoutes } from "./routes/componentes.routes";
export { default as softwareRoutes } from "./routes/software.routes";
export { default as dispositivosRedRoutes } from "./routes/dispositivos-red.routes";
export { default as celularRoutes } from "./routes/celular.routes";
export { default as televisorRoutes } from "./routes/televisor.routes";
export { default as inventarioGeneralRoutes } from "./routes/inventario-general.routes";
export { default as seguimientoEquiposRoutes } from "./routes/seguimiento-equipos.routes";
export { default as seguimientoDispositivosRedRoutes } from "./routes/seguimiento-dispositivos-red.routes";
export { default as seguimientoCelularesRoutes } from "./routes/seguimiento-celulares.routes";
export { default as seguimientoTelevisoresRoutes } from "./routes/seguimiento-televisor.routes";
export { default as seguimientoInventarioGeneralRoutes } from "./routes/seguimiento-inventario-general.routes";
export { default as maintenanceChecklistRoutes } from "./routes/maintenance-checklist.routes";
export { default as activosRoutes } from "./routes/activos.routes";
export { default as tipoActivoRoutes } from "./routes/tipo-activo.routes";
export { default as clasificacionRoutes } from "./routes/clasificacion.routes";
export { default as materialesRoutes } from "./routes/materiales.routes";
export { default as estadoIvGeneralRoutes } from "./routes/estado-iv-general.routes";
