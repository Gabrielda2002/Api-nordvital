// Export entities
export { Programa } from './entities/programa';
export { ProgramaMetaHistorico } from './entities/programa-meta-historico';

// Export services
export { ProgramaMetaService } from './services/goal-program.service';

// Export routes
export { default as programsRoutes } from './routes/programa.routes';
export { default as goalsRoutes } from './routes/programa-meta-historico.routes';

// Export controllers
export * from './controllers/programa.controller';
export * from './controllers/programa-meta-historico.controller';
