import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";
import { Tickets } from "../../tickets/entities/tickets";
@Entity({ name: "encuestas_satisfaccion" })
export class EncuestasSatisfaccion extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;
    
    @Column({ name: "ticket_id", type: "int" })
    @IsInt()
    @IsNotEmpty()
    ticketId: number;

    @Column({ name: "usuario_id", type: "int" })
    @IsInt()
    @IsNotEmpty()
    usuarioId: number;

    @Column({ name: "calificacion_general", type: "int" })
    @IsInt()
    @IsNotEmpty()
    calificacionGeneral: number;

    @Column({ name: "tiempo_respuesta", type: "int" })
    @IsInt()
    @IsNotEmpty()
    tiempoRespuesta: number;

    @Column({ name: "conocimiento_tecnico", type: "int" })
    @IsInt()
    @IsNotEmpty()
    conocimientoTecnico: number;

    @Column({ name: "amabilidad_soporte", type: "int" })
    @IsInt()
    @IsNotEmpty()
    amabilidadSoporte: number;

    @Column({ name: "solucion_efectiva", type: "tinyint" })
    @IsNotEmpty()
    solucionEfectiva: boolean;

    @Column({ name: "comentario", type: "text", nullable: true })
    @IsOptional()
    @Length(1, 500, { message: "El comentario debe tener entre $constraint1 y $constraint2 caracteres" })
    comentario: string;

    @Column({ name: "recomendaria_servicio", type: "tinyint"})
    @IsNotEmpty()
    recomendariaServicio: boolean;

    @CreateDateColumn({ name: "fecha_creacion", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => Usuarios, usuario => usuario.surveyRelation)
    @JoinColumn({ name: "usuario_id" })
    userRelation: Usuarios;

    @ManyToOne(() => Tickets, ticket => ticket.surveyRelation)
    @JoinColumn({ name: "ticket_id" })
    ticketRelation: Tickets;

}