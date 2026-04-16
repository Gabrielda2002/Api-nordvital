import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Usuarios } from "../../auth/entities/usuarios";
import { Sedes } from "../../catalog/entities/sedes";
import { EstadoTickets } from "../../tickets/entities/estado-tickets";
import { Prioridad } from "../../tickets/entities/prioridad";
import { InfrastructureCategory } from "./infrastructure-category";
import { InfrastructureComment } from "./infrastructure-comment";
import { InfrastructureAttachment } from "./infrastructure-attachment";

@Entity({ name: "infrastructure_tickets" })
export class InfrastructureTicket extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "titulo", type: "varchar", length: 255 })
    @IsNotEmpty({ message: "Title is required" })
    @IsString()
    @Length(1, 255, { message: "Title must be between $constraint1 and $constraint2 characters" })
    title: string;

    @Column({ name: "descripcion", type: "text" })
    @IsNotEmpty({ message: "Description is required" })
    @IsString()
    @Length(1, 1000, { message: "Description must be between $constraint1 and $constraint2 characters" })
    description: string;

    @Column({ name: "usuario_id", type: "int" })
    @IsNotEmpty({ message: "User ID is required" })
    @IsNumber()
    userId: number;

    @Column({ name: "categoria_id", type: "int" })
    @IsNotEmpty({ message: "Category ID is required" })
    @IsNumber()
    categoryId: number;

    @Column({ name: "estado_id", type: "int" })
    @IsNotEmpty({ message: "Status ID is required" })
    @IsNumber()
    statusId: number;

    @Column({ name: "prioridad_id", type: "int", default: 4 })
    @IsNotEmpty({ message: "Priority ID is required" })
    @IsNumber()
    priorityId: number;

    @Column({ name: "sede_id", type: "int" })
    @IsNotEmpty({ message: "Sede ID is required" })
    @IsNumber()
    sedeId: number;

    @Column({ name: "ubicacion_descripcion", type: "varchar", length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @Length(1, 255, { message: "Location description must be at most $constraint2 characters" })
    locationDescription?: string;

    @Column({ name: "monto_cotizacion", type: "decimal", precision: 12, scale: 2, nullable: true })
    @IsOptional()
    quotationAmount?: number;

    @CreateDateColumn({ name: "fecha_creacion", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "fecha_actualizacion", type: "timestamp" })
    updatedAt: Date;

    @ManyToOne(() => InfrastructureCategory, (category) => category.ticketsRelation)
    @JoinColumn({ name: "categoria_id" })
    categoryRelation: InfrastructureCategory;

    @ManyToOne(() => Usuarios, (usuario) => usuario.infrastructureTicketsRelation)
    @JoinColumn({ name: "usuario_id" })
    userRelation: Usuarios;

    @ManyToOne(() => EstadoTickets)
    @JoinColumn({ name: "estado_id" })
    statusRelation: EstadoTickets;

    @ManyToOne(() => Prioridad)
    @JoinColumn({ name: "prioridad_id" })
    priorityRelation: Prioridad;

    @ManyToOne(() => Sedes)
    @JoinColumn({ name: "sede_id" })
    sedeRelation: Sedes;

    @OneToMany(() => InfrastructureComment, (comment) => comment.ticketRelation)
    commentsRelation: InfrastructureComment[];

    @OneToMany(() => InfrastructureAttachment, (attachment) => attachment.ticketRelation)
    attachmentsRelation: InfrastructureAttachment[];
}
