import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { NotasTecnicas } from "./notas-tecnicas";

@Entity("services")
export class Servicios extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number;

    @Column({ name: "name", type: "varchar", length: 255 })
    @IsString()
    @IsNotEmpty({ message: "El nombre del servicio es requerido" })
    @Length(3, 50, { message: "El nombre del servicio debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string;

    @Column({ name: "status", type: "tinyint", default: 1 })
    @IsBoolean()
    @IsNotEmpty({ message: "El estado del servicio es requerido" })
    status: boolean;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, radicacion => radicacion.servicesRelation)
    radicacionRelation: Radicacion[]

    // relacion con notas tecnicas
    @OneToMany(() => NotasTecnicas, notasTecnicas => notasTecnicas.typeServiceRelation)
    notasTecnicasRelation: NotasTecnicas[]
}