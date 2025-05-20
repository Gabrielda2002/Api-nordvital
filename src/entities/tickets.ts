import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Usuarios } from "./usuarios";
import { Categorias } from "./categorias";
import { Prioridad } from "./prioridad";
import { EstadoTickets } from "./estado-tickets";
import { Comentarios } from "./comentarios";
import { EncuestasSatisfaccion } from "./encuestas-satisfaccion";

@Entity("tickets")
export class Tickets extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "titulo", length: 255 })
    title: string;

    @Column({ name: "descripcion", type: "text" })
    description: string;

    @Column({ name: "usuario_id" })
    userId: number;

    @Column({ name: "categoria_id" })
    categoryId: number;

    @Column({ name: "estado_id" })
    statusId: number;

    @Column({ name: "prioridad_id" })
    preorityId: number;

    @Column({ name: 'remoto', type: "tinyint", width: 1, default: 0 })
    remote: boolean;

    @CreateDateColumn({ name: "fecha_creacion", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "fecha_actualizacion", type: "timestamp" })
    updatedAt: Date;

    @ManyToOne(() => Categorias, (categoria) => categoria.ticketsRelation)
    @JoinColumn({ name: "categoria_id" })
    categoryRelation: Categorias;

    @ManyToOne(() => Usuarios, (usuario) => usuario.ticketsRelation)
    @JoinColumn({ name: "usuario_id" })
    userRelation: Usuarios;

    @ManyToOne(() => EstadoTickets, (estado) => estado.ticketsRelation)
    @JoinColumn({ name: "estado_id" })
    statusRelation: EstadoTickets;

    @ManyToOne(() => Prioridad, (prioridad) => prioridad.ticketsRelation)
    @JoinColumn({ name: "prioridad_id" })
    priorityRelation: Prioridad;

    @OneToMany(() => Comentarios, (comentarios) => comentarios.ticketsRelation)
    commentRelation: Comentarios[];

    // relacion con encuestas
    @OneToMany(() => EncuestasSatisfaccion, (encuestas) => encuestas.ticketRelation)
    surveyRelation: EncuestasSatisfaccion[];
}