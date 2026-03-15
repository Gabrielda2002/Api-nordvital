import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, NumericType, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity("service_groups")
export class GrupoServicios extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number

    @Column({ name: "name" })
    @IsNotEmpty({ message: "El nombre del grupo de servicios es requerido" })
    @IsString()
    @Length(3, 50, { message: "El nombre del grupo de servicios debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({ name: "status" })
    @IsBoolean()
    @IsNotEmpty({ message: "El estado del grupo de servicios es requerido" })
    status: boolean

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones

    @OneToOne(() => Radicacion, (radicacion) => radicacion.servicesGroupRelation )
    radicacionRelation: Radicacion[]
}