import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "./roles";
import { PermisosRol } from "./permisos-rol";

@Entity("permisos")
export class Permisos extends BaseEntity {
    
    @PrimaryGeneratedColumn({ name: "Id"})
    id: number

    @Column({ name: "Nombre"})
    name: string

    @Column({ name: "Descripcion"})
    description: string

    @Column({ name: "nombre_variable"})
    nameVariable: string

    @Column({ name: "Modulo_Relacionado"})
    relatedModule: string
    
    @CreateDateColumn({ name: "Fecha_Creacion" })
    createdAt: Date

    // @UpdateDateColumn()
    // updateAt: Date

    @OneToMany(() => PermisosRol, (permisosRol) => permisosRol.permisosRelation)
    permisosRolRelation: PermisosRol[]
    
}