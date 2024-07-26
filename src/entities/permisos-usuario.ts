import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";
import { Permisos } from "./permisos";
import { IsInt, IsNotEmpty } from "class-validator";

@Entity({name: "permisosusuario"})
export class PermisosUsuarios extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "id_usuario"})
    @IsInt()
    @IsNotEmpty({message: "El campo id_usuario no puede estar vacio"})
    idUser: number;

    @Column({name: "id_permiso"})
    @IsInt()
    @IsNotEmpty({message: "El campo id_permiso no puede estar vacio"})
    idPermiso: number;

    @CreateDateColumn({name: "fecha_creacion"})
    createdat: Date;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    // * relaciones

    @ManyToOne(() => Usuarios, (usuarios) => usuarios.permisosUsuariosRelation)
    @JoinColumn({name: "id_usuario"}) 
    userRelation: Usuarios;

    @ManyToOne(()=> Permisos, (permisos) => permisos.permisosUsuariosRelation)
    @JoinColumn({name: "id_permiso"})
    permisoRelation: Permisos;

}