import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Carpeta } from "./carpeta";

@Entity({name: "archivos"})
export class Archivos extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "nombre"})
    @IsNotEmpty({message: "El nombre del archivo no puede estar vacío"})
    name: string;

    @Column({name: "ruta"})
    @IsNotEmpty({message: "La ruta del archivo no puede estar vacía"})
    path: string;

    @Column({name: "tamano"})
    @IsNotEmpty({message: "El tamaño del archivo no puede estar vacío"})
    size: number;

    @Column({name: "carpeta_id"})
    // @IsNotEmpty({message: "El id de la carpeta no puede estar vacío"})
    folderId: number;

    @Column({name: "mimeType"})
    @IsNotEmpty({message: "El tipo de archivo no puede estar vacío"})
    mimeType: string;

    @CreateDateColumn({name: "createdAt"})
    createdAt: Date;

    @UpdateDateColumn({name: "updatedAt"})
    updateAt: Date;

    @Column({name: "name_saved"})
    nameSaved: string;

    // * relacion con carpetas

    @ManyToOne(() => Carpeta, (carpeta) => carpeta.fileRelation)
    @JoinColumn({name: "carpeta_id"})
    folderRelation: Carpeta;    
}