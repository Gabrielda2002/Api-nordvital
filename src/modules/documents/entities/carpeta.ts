import { IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";
import { Archivos } from "./archivos";
import { departamentos } from "../../catalog/entities/departamentos";

@Entity({name: "folders"})
export class Carpeta extends BaseEntity {


    @PrimaryGeneratedColumn({name:'id' })
    id: number;

    @Column({name:'name'})
    @IsNotEmpty({message: "El nombre de la carpeta no puede estar vacío"})
    name: string;

    @Column({name:'user_id'})
    // @IsNotEmpty({message: "El id del usuario no puede estar vacío"})
    userId: number;

    @Column({name:'parent_folder_id' , nullable: true})
    parentFolderId: number | null;

    @Column({name:'path', type: 'text'})
    @IsNotEmpty({message: "La ruta de la carpeta no puede estar vacía"})
    path: string;
    
    @Column({name: "section", default: "ssg"})
    seccion: string;
    
    @Column({ name: 'department_id', nullable: false, default: 1 })
    idDepartment: number;

    @Column({ name: "icon", nullable: false, type: "varchar", length: 50})
    @IsString()
    icon?: string;
    
    @CreateDateColumn({name:'created_at'})
    createdAt: Date;
    
    @UpdateDateColumn({name:'updated_at'})
    updateAt: Date;

    // * relacion con usuarios
    @ManyToOne(() => Usuarios, (usuario) => usuario.folderRelation )
    @JoinColumn({name:'user_id'})
    userRelation: Usuarios;

    // * relacion jerarquica de carpeta_padre_id con id
    @ManyToOne(() => Carpeta, (carpeta) => carpeta.childRelation)
    @JoinColumn({name:'parent_folder_id'})
    parentFolderRelation: Carpeta;

    @OneToMany(() => Carpeta, (carpeta) => carpeta.parentFolderRelation)
    childRelation: Carpeta[];

    // * relacion con archivos
    @OneToMany(() => Archivos, (archivo) => archivo.folderRelation)
    fileRelation: Archivos[];

    @ManyToOne(() => departamentos, (departamento) => departamento.folderRelation)
    @JoinColumn({ name: 'department_id' })
    departmentRelation: departamentos;

}
