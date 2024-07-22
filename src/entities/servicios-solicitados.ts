import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "serviciosolicitado"})
export class ServiciosSolicitados extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdServicioSolicitado"})
    id: number;

    @Column({name: "Codigo"})
    code: string;

    @Column({name: "NombreSolicitado"})
    name: string;

    @Column({name: "EstadoCup"}) 
    status: string;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date
}