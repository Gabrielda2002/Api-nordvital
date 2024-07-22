import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermisosUsuarios } from "./permisos-usuario";
import { Municipio } from "./municipio";
import { Roles } from "./roles";
import { TipoDocumento } from "./tipo-documento";

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

    // * relaciones

    // * relaciones sin llaves foraneas

    // * relaciones con permisos usuario
    @OneToMany(() => PermisosUsuarios, (permisosUsuarios) => permisosUsuarios.userRelation)
    permisosUsuariosRelation: PermisosUsuarios[];

    // * relaciones con llaves foraneas

    // * relacion con municipio
    @ManyToOne(() => Municipio, (municipio) => municipio.usuarioRelation)
    @JoinColumn({name: "Nit_Municipio"})
    municipioRelation: Municipio;

    // * relacion con roles
    @ManyToOne(()=> Roles, (roles) => roles.usuarioRelation)
    @JoinColumn({name: "Tipo_rol"})
    rolesRelation: Roles

    @ManyToOne(()=> TipoDocumento, (tipoDocumento) => tipoDocumento.usuarioRelation)
    @JoinColumn({name: "TipoCedula"})
    typeDocumentRelation: TipoDocumento

    


}