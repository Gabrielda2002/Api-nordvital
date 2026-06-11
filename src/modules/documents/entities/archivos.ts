import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Carpeta } from "./carpeta";

@Entity({name: "documents"})
export class Archivos extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "name"})
    @IsNotEmpty({message: "El nombre del archivo no puede estar vacío"})
    name: string;

    @Column({name: "path", type: 'text'})
    @IsNotEmpty({message: "La ruta del archivo no puede estar vacía"})
    path: string;

    @Column({name: "size"})
    @IsNotEmpty({message: "El tamaño del archivo no puede estar vacío"})
    size: number;

    @Column({name: "folder_id"})
    // @IsNotEmpty({message: "El id de la carpeta no puede estar vacío"})
    folderId: number;

    @Column({name: "mimeType"})
    @IsNotEmpty({message: "El tipo de archivo no puede estar vacío"})
    mimeType: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updateAt: Date;

    @Column({name: "name_saved"})
    nameSaved: string;

    // * relacion con carpetas

    @ManyToOne(() => Carpeta, (carpeta) => carpeta.fileRelation)
    @JoinColumn({name: "folder_id"})
    folderRelation: Carpeta;    
}
