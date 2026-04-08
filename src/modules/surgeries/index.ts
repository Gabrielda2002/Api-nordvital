// Entities
export { Cirugias } from './entities/cirugias';
export { SeguimientoAuxiliarCirugias } from './entities/seguimiento-auxiliar-cirugias';

// Controllers
export {
  getAllSurgery,
  getSurgery,
  createSurgery,
  updateSurgery,
  deleteSurgery,
  getSurgeryTable
} from './controllers/cirugias.controller';

export {
  getAllAuxiliarySurgeries,
  getAuxiliarySurgery,
  createAuxiliarySurgery,
  updateAuxiliarySurgery,
  deleteAuxiliarySurgery
} from './controllers/seguimiento-auxiliar-cirugias.controller';

// Routes
export { default as cirugiasRoutes } from './routes/cirugias.routes';
export { default as seguimientoAuxiliarCirugiasRoutes } from './routes/seguimiento-auxiliar-cirugias.routes';

// Services
export { getReportSurgerysRows, type ReportSurgerysFilters, type ReportSurgerysRow } from './services/report-surgerys.service';
