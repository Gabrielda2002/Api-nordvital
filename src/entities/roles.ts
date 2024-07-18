import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permisos } from "./permisos";
import { PermisosRol } from "./permisos-rol";
import { Usuarios } from "./usuarios";

@Entity("rol")
export class Roles extends BaseEntity {

    @PrimaryGeneratedColumn({name: 'IdRol'})
    id: number;

    @Column({name: 'TipoRol'})
    name: string;

    @OneToMany(() => PermisosRol, (permisosRol) => permisosRol.rolRelation)
    permisosRolRelation: PermisosRol[]

    @OneToMany(() => Usuarios, (usuarios) => usuarios.rolesRelation)
    usuarioRelation: Usuarios[]
}