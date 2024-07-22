import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "./usuarios";
import { Permisos } from "./permisos";

@Entity({name: "permisosusuario"})
export class PermisosUsuarios extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "id_usuario"})
    idUser: number;

    @Column({name: "id_permiso"})
    idPermiso: number;

    @CreateDateColumn({name: "fecha_creacion"})
    createdat: Date;

    // * relaciones

    @ManyToOne(() => Usuarios, (usuarios) => usuarios.permisosUsuariosRelation)
    @JoinColumn({name: "id_usuario"}) 
    userRelation: Usuarios;

    @ManyToOne(()=> Permisos, (permisos) => permisos.permisosUsuariosRelation)
    @JoinColumn({name: "id_permiso"})
    permisoRelation: Permisos;

}