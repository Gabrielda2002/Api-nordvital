import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";
import { Pqrsdf, type EstadoPqrs } from "./pqrsdf";

@Entity({ name: "pqrsdf_status_history" })
export class PqrsdfStatusHistory extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int", unsigned: true, comment: "Identificador único del registro de historial" })
    id: number;

    @Column({ name: "pqrsdf_id", type: "int", unsigned: true, comment: "FK a pqrsdf — PQRSDF a la que pertenece el historial" })
    @IsInt()
    @IsNotEmpty({ message: "La PQRSDF no puede estar vacía" })
    pqrsdfId: number;

    @Column({ name: "status", type: "enum", enum: ["ABIERTO", "EN_GESTION", "CERRADO"], comment: "Estado alcanzado en esta transición" })
    @IsEnum(["ABIERTO", "EN_GESTION", "CERRADO"], { message: "El estado del historial no es válido" })
    status: EstadoPqrs;

    @Column({ name: "note", type: "text", nullable: true, comment: "Nota de la transición (obligatoria en cambios de estado, opcional en la creación)" })
    @IsOptional()
    @IsString()
    note: string | null;

    @Column({ name: "actor_id", type: "int", nullable: true, comment: "FK a users — usuario que realizó la transición" })
    @IsOptional()
    @IsInt()
    actorId: number | null;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    // ? relacion con la pqrsdf
    @ManyToOne(() => Pqrsdf, (pqrsdf) => pqrsdf.statusHistoryRelation)
    @JoinColumn({ name: "pqrsdf_id" })
    pqrsdfRelation: Pqrsdf;

    // ? relacion con el usuario actor
    @ManyToOne(() => Usuarios, (usuario) => usuario.pqrsdfStatusHistoryRelation, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "actor_id" })
    actorRelation: Usuarios | null;
}
