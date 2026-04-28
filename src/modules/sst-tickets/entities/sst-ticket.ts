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
import { SstCategory } from "./sst-category";
import { SstComment } from "./sst-comment";
import { SstAttachment } from "./sst-attachment";

@Entity({ name: "sst_tickets" })
export class SstTicket extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "title", type: "varchar", length: 255 })
    @IsNotEmpty({ message: "Title is required" })
    @IsString()
    @Length(1, 100, { message: "Title must be between $constraint1 and $constraint2 characters" })
    title: string;

    @Column({ name: "description", type: "text" })
    @IsNotEmpty({ message: "Description is required" })
    @IsString()
    @Length(1, 1000, { message: "Description must be between $constraint1 and $constraint2 characters" })
    description: string;

    @Column({ name: "user_id", type: "int" })
    @IsNumber({}, { message: "User ID must be a number" })
    @IsNotEmpty({ message: "User ID is required" })
    userId: number;

    @Column({ name: "category_id", type: "int" })
    @IsNumber({}, { message: "Category ID must be a number" })
    @IsNotEmpty({ message: "Category ID is required" })
    categoryId: number;

    @Column({ name: "status_id", type: "int" })
    @IsNumber({}, { message: "Status ID must be a number" })
    @IsNotEmpty({ message: "Status ID is required" })
    statusId: number;

    @Column({ name: "priority_id", type: "int", default: 4 })
    @IsNumber({}, { message: "Priority ID must be a number" })
    @IsNotEmpty({ message: "Priority ID is required" })
    priorityId: number;

    @Column({ name: "sede_id", type: "int" })
    @IsNumber({}, { message: "Sede ID must be a number" })
    @IsNotEmpty({ message: "Sede ID is required" })
    sedeId: number;

    @Column({ name: "location_description", type: "varchar", length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @Length(1, 255, { message: "Location description must be at most $constraint2 characters" })
    locationDescription?: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;

    @ManyToOne(() => SstCategory, (category) => category.ticketsRelation)
    @JoinColumn({ name: "category_id" })
    categoryRelation: SstCategory;

    @ManyToOne(() => Usuarios, (usuario) => usuario.sstTicketsRelation)
    @JoinColumn({ name: "user_id" })
    userRelation: Usuarios;

    @ManyToOne(() => EstadoTickets)
    @JoinColumn({ name: "status_id" })
    statusRelation: EstadoTickets;

    @ManyToOne(() => Prioridad)
    @JoinColumn({ name: "priority_id" })
    priorityRelation: Prioridad;

    @ManyToOne(() => Sedes)
    @JoinColumn({ name: "sede_id" })
    sedeRelation: Sedes;

    @OneToMany(() => SstComment, (comment) => comment.ticketRelation)
    commentsRelation: SstComment[];

    @OneToMany(() => SstAttachment, (attachment) => attachment.ticketRelation)
    attachmentsRelation: SstAttachment[];
}
