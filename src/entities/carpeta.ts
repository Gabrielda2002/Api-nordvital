import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";
import { Archivos } from "./archivos";
import { arch } from "os";
import { Municipio } from "./municipio";
import { departamentos } from "./departamentos";

@Entity({name: "carpetas"})
export class Carpeta extends BaseEntity {


    @PrimaryGeneratedColumn({name:'id' })
    id: number;

    @Column({name:'nombre'})
    @IsNotEmpty({message: "El nombre de la carpeta no puede estar vacío"})
    name: string;

    @Column({name:'user_id'})
    // @IsNotEmpty({message: "El id del usuario no puede estar vacío"})
    userId: number;

    @Column({name:'carpeta_padre_id' , nullable: true})
    parentFolderId: number | null;

    @Column({name:'ruta', type: 'text'})
    @IsNotEmpty({message: "La ruta de la carpeta no puede estar vacía"})
    path: string;

    @CreateDateColumn({name:'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name:'updatedAt'})
    updateAt: Date;

    @Column({name: "id_municipio", nullable: true})
    idMunicipio: number;

    @Column({name: "seccion", default: "ssg"})
    seccion: string;

    @Column({ name: 'id_departamento', nullable: false, default: 1 })
    idDepartment: number;

    // * relacion con usuarios
    @ManyToOne(() => Usuarios, (usuario) => usuario.folderRelation )
    @JoinColumn({name:'user_id'})
    userRelation: Usuarios;

    // * relacion jerarquica de carpeta_padre_id con id
    @ManyToOne(() => Carpeta, (carpeta) => carpeta.childRelation)
    @JoinColumn({name:'carpeta_padre_id'})
    parentFolderRelation: Carpeta;

    @ManyToOne(() => Municipio, (municipio) => municipio.folderRelation)
    @JoinColumn({name: "id_municipio"})
    municipioRelation: Municipio;

    @OneToMany(() => Carpeta, (carpeta) => carpeta.parentFolderRelation)
    childRelation: Carpeta[];

    // * relacion con archivos
    @OneToMany(() => Archivos, (archivo) => archivo.folderRelation)
    fileRelation: Archivos[];

    @ManyToOne(() => departamentos, (departamento) => departamento.folderRelation)
    @JoinColumn({ name: 'id_departamento' })
    departamentoRelation: departamentos;

}