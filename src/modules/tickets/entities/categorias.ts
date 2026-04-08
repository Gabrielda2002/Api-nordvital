import { IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Tickets } from "./tickets";
import { Prioridad } from "./prioridad";

type TicketType = "Solicitud" | "Incidente";

@Entity({name: 'categorias'})
export class Categorias extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "nombre", type: "varchar", length: 255, unique: true})
    @Length(1, 255, { message: "Name must be between 1 and 255 characters" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column({name: "descripcion", type: "text", nullable: true})
    @Length(0, 150, { message: "Description must be at most 150 characters" })
    @IsString()
    description?: string;

    @Column({name: "prioridad_id", nullable: true})
    priorityId?: number;

    @Column({name: "tipo_ticket", type: "enum", enum: ["Solicitud", "Incidente"], nullable: true})
    @IsEnum(["Solicitud", "Incidente"], { message: "Type must be either 'Solicitud' or 'Incidente'" })
    ticketType?: TicketType;

    @ManyToOne(() => Prioridad, { nullable: true })
    @JoinColumn({ name: "prioridad_id" })
    priorityRelation?: Prioridad;

    @OneToMany(() => Tickets, tickets => tickets.categoryRelation)
    ticketsRelation: Tickets[];
}
