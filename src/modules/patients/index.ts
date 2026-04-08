// Entities
export * from './entities/pacientes';
export * from './entities/pacientes-coosalud';
export * from './entities/diagnostico';

// Controllers
export * from './controllers/pacientes.controller';
export * from './controllers/pacientes-coosalud.controller';
export * from './controllers/diagnostico.controller';

// Routes
export { default as pacientesRoutes } from './routes/pacientes.routes';
export { default as pacientesCoosaludRoutes } from './routes/pacientes-coosalud.routes';
export { default as diagnosticosRoutes } from './routes/diagnosticos.routes';
