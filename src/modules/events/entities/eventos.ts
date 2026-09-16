import { IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";

@Entity()
export class Eventos extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "titulo", type: "varchar"})
    @IsNotEmpty({message: "Title is required"})
    @IsString()
    @Length(2, 200, {message: "Title must be between $constraint1 and $constraint2 characters"})
    title: string;

    @Column({name: "fecha_inicio", type: "timestamp"})
    @IsNotEmpty({message: "Start date is required"})
    dateStart: Date;

    @Column({name: "fecha_fin", type: "timestamp"})
    @IsNotEmpty({message: "End date is required"})
    dateEnd: Date;

    @Column({name: "color", type: "varchar"})
    @IsNotEmpty({message: "Color is required"})
    color: string;

    @Column({name: "descripcion", type: "text"})
    @IsString()
    @IsNotEmpty({message: "Description is required"})
    @Length(2, 300, {message: "Description must be between $constraint1 and $constraint2 characters"})
    description: string;

    @CreateDateColumn({name: "created_at", type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at", type: "timestamp"})
    updatedAt: Date;

    @Column({name: "hora_inicio", type: "time", nullable: false})
    @IsNotEmpty({message: "Start time is required"})
    @IsString()
    timeStart: string;

    @Column({name: "hora_fin", type: "time", nullable: false})
    @IsNotEmpty({message: "End time is required"})
    @IsString()
    timeEnd: string;

    // * Lugar donde se realiza el evento
    @Column({name: "place", type: "varchar", length: 100, nullable: true})
    @IsOptional()
    @IsString()
    @Length(2, 100, {message: "Place must be between $constraint1 and $constraint2 characters"})
    place: string;

    // * Autor del evento (FK escalar para asignar sin cargar la entidad completa)
    @Column({name: "autor_id", type: "int", nullable: true})
    @IsOptional()
    @IsInt()
    authorId: number;

    // * Relacion unidireccional con usuarios (no se declara el lado inverso)
    @ManyToOne(() => Usuarios, {nullable: true, onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "autor_id"})
    authorRelation: Usuarios;

}
