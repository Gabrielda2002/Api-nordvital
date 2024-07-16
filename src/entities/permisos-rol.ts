import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./roles";
import { Permisos } from "./permisos";

@Entity("permisosrol")
export class PermisosRol extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "id_rol"})
    idRol: number

    @Column({name: "id_permisos"})
    idPermisos: number

    @ManyToOne(() => Roles, (roles) => roles.permisosRolRelation)
    @JoinColumn({name: "id_rol"})
    rolRelation: Roles

    @ManyToOne(() => Permisos, (permisos) => permisos.permisosRolRelation)
    @JoinColumn({name: "id_permisos"})
    permisosRelation: Permisos
}