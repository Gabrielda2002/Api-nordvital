import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permisos } from "./permisos";
import { PermisosRol } from "./permisos-rol";
import { Usuarios } from "./usuarios";
import { IsNotEmpty, IsString, Length } from "class-validator";

@Entity("rol")
export class Roles extends BaseEntity {

    @PrimaryGeneratedColumn({name: 'IdRol'})
    id: number;

    @Column({name: 'TipoRol'})
    @IsNotEmpty({message: 'El nombre del rol es requerido'})
    @IsString()
    @Length(3, 50, {message: 'El nombre del rol debe tener entre $constraint1 y $constraint2 caracteres'})
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