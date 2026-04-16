import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InfrastructureTicket } from "./infrastructure-ticket";
import { Prioridad } from "../../tickets/entities/prioridad";

@Entity({ name: "infrastructure_categories" })
export class InfrastructureCategory extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 255, unique: true })
    @IsNotEmpty({ message: "Name is required" })
    @IsString()
    @Length(1, 255, { message: "Name must be between $constraint1 and $constraint2 characters" })
    name: string;

    @Column({ name: "descripcion", type: "text", nullable: true })
    @IsOptional()
    @IsString()
    @Length(0, 500, { message: "Description must be at most $constraint2 characters" })
    description?: string;

    @Column({ name: "prioridad_id", nullable: true })
    @IsOptional()
    priorityId?: number;

    @ManyToOne(() => Prioridad, { nullable: true })
    @JoinColumn({ name: "prioridad_id" })
    priorityRelation?: Prioridad;

    @OneToMany(() => InfrastructureTicket, (ticket) => ticket.categoryRelation)
    ticketsRelation: InfrastructureTicket[];
}
