import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "usuario"})
export class Usuarios extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdUsuario"})
    id: number;

    @Column({name: "CedulaUsuario"})
    dniNumber: number;

    @Column({name: "NombreUsuario"})
    name: string;

    @Column({name: "ApellidoUsuario"})
    lastName: string;

    @Column({name: "TipoCedula"})
    dniType: string;

    @Column({name: "EmailUsuario"})
    email: string;

    @Column({name: "ClaveUsuario"})
    password: string;

    @Column({name: "fecha"})
    date: Date;

    @Column({name: "EstadoUsuario"})
    status: string;

    @Column({name: "Nit_Municipio"})
    municipio: number;

    @Column({name: "Tipo_rol"})
    rol: string;

    @Column({name: "imagen"})
    photo: string;
}