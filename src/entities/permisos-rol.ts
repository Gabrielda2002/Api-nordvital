import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "./roles";
import { Permisos } from "./permisos";
import { IsInt, IsNotEmpty } from "class-validator";

@Entity("permisosrol")
export class PermisosRol extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "id_rol"})
    @IsInt()
    @IsNotEmpty({message: "El campo id_rol no puede estar vacio"})
    idRol: number

    @Column({name: "id_permisos"})
    @IsInt()
    @IsNotEmpty({message: "El campo id_permisos no puede estar vacio"})
    idPermisos: number

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @ManyToOne(() => Roles, (roles) => roles.permisosRolRelation)
    @JoinColumn({name: "id_rol"})
    rolRelation: Roles

    @ManyToOne(() => Permisos, (permisos) => permisos.permisosRolRelation)
    @JoinColumn({name: "id_permisos"})
    permisosRelation: Permisos
}