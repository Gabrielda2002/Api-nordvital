import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PermisosUsuarios } from "./permisos-usuario";
import { Municipio } from "./municipio";
import { Roles } from "./roles";
import { TipoDocumento } from "./tipo-documento";
import { IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator";
import { Transform } from "stream";
import { Carpeta } from "./carpeta";
import { Radicacion } from "./radicacion";

@Entity({name: "usuario"})
export class Usuarios extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdUsuario"})
    id: number;

    @Column({name: "CedulaUsuario"})
    @IsInt()
    @IsNotEmpty({message: "El número de cédula es requerido"})
    dniNumber: number;

    @Column({name: "NombreUsuario"})
    @IsString()
    @IsNotEmpty({message: "El nombre del usuario es requerido"})
    @Length(2, 150, {message: "El nombre del usuario debe tener entre 3 y 50 caracteres"})
    name: string;

    @Column({name: "ApellidoUsuario"})
    @IsString()
    @IsNotEmpty({message: "El apellido del usuario es requerido"})
    @Length(2, 150, {message: "El apellido del usuario debe tener entre 3 y 50 caracteres"})
    lastName: string;

    @Column({name: "TipoCedula"})
    @IsInt()
    @IsNotEmpty({message: "El tipo de cédula es requerido"})
    dniType: number;

    @Column({name: "EmailUsuario"})
    @IsEmail()
    @IsOptional()
    @Length(10, 150, {message: "El email del usuario debe tener entre 10 y 150 caracteres"})
    email: string;

    @Column({name: "ClaveUsuario"})
    @IsString()
    @IsNotEmpty({message: "La contraseña del usuario es requerida"})
    @Length(8, 150, {message: "La contraseña del usuario debe tener entre 8 y 150 caracteres"})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
        message:
          "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial (!@#$%^&*)",
      })      
    password: string;

    @Column({name: "fecha"})
    @IsOptional()
    date: Date;

    @Column({name: "Estado"})
    @IsBoolean()
    @IsNotEmpty({message: "El estado del usuario es requerido"})
    status: boolean;

    @Column({name: "Nit_Municipio"})
    @IsInt()
    @IsNotEmpty({message: "El municipio es requerido"})
    // @Length(1, 10, {message: "El municipio debe tener entre 1 y 10 dígitos"})
    municipio: number;

    @Column({name: "Tipo_rol"})
    @IsInt()
    @IsNotEmpty({message: "El rol es requerido"})
    rol: number;

    @Column({name: "imagen"})
    @IsString()
    @IsOptional()
    photo: string;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

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

    
// * relacion con carpeta

@OneToMany(() => Carpeta, (carpeta) => carpeta.userRelation)
folderRelation: Carpeta[]

  // relacion con radicacion
  @OneToMany(() => Radicacion, (radicacion) => radicacion.usuarioRelation)
  radicacionRelation: Radicacion[];

}