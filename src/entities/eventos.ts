import { IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Eventos extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "titulo", type: "varchar"})
    @IsNotEmpty()
    @IsString()
    @Length(2, 200, {message: "El titulo debe tener entre $constraint1 y $constraint2 caracteres"})
    title: string;

    @Column({name: "fecha_inicio", type: "date"})
    @IsNotEmpty()
    dateStart: Date;

    @Column({name: "fecha_fin", type: "date"})
    @IsNotEmpty()
    dateEnd: Date;

    @Column({name: "color", type: "varchar"})
    @IsNotEmpty()
    color: string;

    @Column({name: "descripcion", type: "text"})
    @IsString()
    @IsNotEmpty()
    @Length(2, 300, {message: "La descripcion debe tener entre $constraint1 y $constraint2 caracteres"})
    description: string;

    @CreateDateColumn({name: "created_at", type: "timestamp"})
    createdAt: Date;

    @CreateDateColumn({name: "updated_at", type: "timestamp"})
    updatedAt: Date;
}