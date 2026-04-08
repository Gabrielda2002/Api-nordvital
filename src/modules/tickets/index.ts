// Entities
export { Tickets } from "./entities/tickets";
export { TicketAttachment } from "./entities/ticket-attachment";
export { EstadoTickets } from "./entities/estado-tickets";
export { Prioridad } from "./entities/prioridad";
export { Categorias } from "./entities/categorias";
export { Comentarios } from "./entities/comentarios";

// Controllers
export * from "./controllers/tickets.controller";
export * from "./controllers/ticket-attachments.controller";
export * from "./controllers/estados-tickets.controller";
export * from "./controllers/prioridad.controller";
export * from "./controllers/categorias.controller";
export * from "./controllers/comentarios.controller";

// Routes
export { default as ticketsRoutes } from "./routes/tickets.routes";
export { default as ticketAttachmentsRoutes } from "./routes/ticket-attachments.routes";
export { default as estadosTicketsRoutes } from "./routes/estados-tickets.routes";
export { default as prioridadRoutes } from "./routes/prioridad.routes";
export { default as categoriasRoutes } from "./routes/categorias.routes";
export { default as comentariosRoutes } from "./routes/comentarios.routes";

// Services
export * from "./services/report-tickets.service";
