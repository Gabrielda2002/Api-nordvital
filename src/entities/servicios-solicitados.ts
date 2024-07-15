import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}