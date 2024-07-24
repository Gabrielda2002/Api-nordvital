import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, NumericType, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity("gruposervicio")
export class GrupoServicios extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdGrupo"})
    id: number

    @Column({name: "NombreGrupo"})
    @IsNotEmpty({message: "El nombre del grupo de servicios es requerido"})
    @IsString()
    @Length(3, 50, {message: "El nombre del grupo de servicios debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "Estado"})
    @IsBoolean()
    @IsNotEmpty({message: "El estado del grupo de servicios es requerido"})
    status: boolean

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToOne(() => Radicacion, (radicacion) => radicacion.servicesGroupRelation )
    radicacionRelation: Radicacion[]
}