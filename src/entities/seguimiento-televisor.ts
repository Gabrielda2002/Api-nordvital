import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsDate, IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { Televisor } from "./televisor";
import { Usuarios } from "./usuarios";

@Entity({name: "seguimiento_televisores"})
export class SeguimientoTelevisor extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "televisor_id"})
    @IsInt()
    @IsNotEmpty({message: "El ID del televisor es requerido"})
    televisorId: number;

    @Column({name: "fecha_evento"})
    @IsNotEmpty({message: "La fecha del evento es requerida"})
    eventDate: Date;

    @Column({name: "tipo_evento"})
    @IsString()
    @IsNotEmpty({message: "El tipo de evento es requerido"})
    @Length(3, 255, {message: "El tipo de evento debe tener entre $constraint1 y $constraint2 caracteres"})
    eventType: string;

    @Column({name: "descripcion"})
    @IsString()
    @IsNotEmpty({message: "La descripción es requerida"})
    description: string;

    @Column({name: "responsable"})
    @IsInt()
    @IsNotEmpty({message: "El responsable es requerido"})
    responsable: number;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    // Relaciones
    @ManyToOne(() => Televisor, televisor => televisor.seguimientoRelation)
    @JoinColumn({ name: "televisor_id" })
    televisorRelation: Televisor;

    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: "responsable" })
    usuarioRelation: Usuarios;
}