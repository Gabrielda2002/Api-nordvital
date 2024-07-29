import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PermisosRol } from "./permisos-rol";
import { PermisosUsuarios } from "./permisos-usuario";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

@Entity("permisos")
export class Permisos extends BaseEntity {
    
    @PrimaryGeneratedColumn({ name: "Id"})
    id: number

    @Column({ name: "Nombre"})
    @IsString()
    @IsNotEmpty({ message: "El nombre es requerido" })
    @Length(3, 50, { message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({ name: "Descripcion"})
    @IsString()
    @IsNotEmpty({ message: "La descripción es requerida" })
    @Length(3, 50, { message: "La descripción debe tener entre $constraint1 y $constraint2 caracteres" })
    description: string

    @Column({ name: "nombre_variable"})
    @IsString()
    @IsNotEmpty({ message: "El nombre de la variable es requerido" })
    @Length(3, 50, { message: "El nombre de la variable debe tener entre $constraint1 y $constraint2 caracteres" })
    nameVariable: string

    @Column({ name: "Modulo_Relacionado"})
    @IsString()
    @IsOptional()
    @Length(3, 50, { message: "El modulo relacionado debe tener entre $constraint1 y $constraint2 caracteres" })
    relatedModule: string
    
    @CreateDateColumn({ name: "Fecha_Creacion" })
    createdAt: Date

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    // * relaciones

    // * relacion con permisosRol
    @OneToMany(() => PermisosRol, (permisosRol) => permisosRol.permisosRelation)
    permisosRolRelation: PermisosRol[]

    // * relacion con usuariosPermisos
    @OneToMany(()=> PermisosUsuarios, (permisosUsuario) => permisosUsuario.permisoRelation)
    permisosUsuariosRelation: PermisosUsuarios[]
    
}