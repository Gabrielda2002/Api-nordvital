import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permisos } from "./permisos";
import { PermisosRol } from "./permisos-rol";
import { Usuarios } from "./usuarios";

@Entity("rol")
export class Roles extends BaseEntity {

    @PrimaryGeneratedColumn({name: 'IdRol'})
    id: number;

    @Column({name: 'TipoRol'})
    name: string;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => PermisosRol, (permisosRol) => permisosRol.rolRelation)
    permisosRolRelation: PermisosRol[]

    @OneToMany(() => Usuarios, (usuarios) => usuarios.rolesRelation)
    usuarioRelation: Usuarios[]
}