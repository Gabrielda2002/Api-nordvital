import { IsInt, IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class EncuestasSatisfaccion extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;
    
    @Column({ name: "ticket_id" })
    @IsInt()
    @IsNotEmpty()
    ticketId: number;

    @Column({ name: "usuario_id" })
    @IsInt()
    @IsNotEmpty()
    usuarioId: number;

    @Column({ name: "calificacion_general" })
    @IsInt()
    @IsNotEmpty()
    calificacionGeneral: number;

    @Column({ name: "tiempo_respuesta" })
    @IsInt()
    @IsNotEmpty()
    tiempoRespuesta: number;

    @Column({ name: "conocimiento_tecnico" })
    @IsInt()
    @IsNotEmpty()
    conocimientoTecnico: number;

    @Column({ name: "amabilidad_soporte" })
    @IsInt()
    @IsNotEmpty()
    amabilidadSoporte: number;

    @Column({ name: "solucion_efectiva" })
    solucionEfectiva: boolean;

    @Column({ name: "comentario" })
    comentario: string;

    @Column({ name: "recomendaria_servicio" })
    recomendariaServicio: boolean;

    @CreateDateColumn({ name: "fecha_creacion", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}