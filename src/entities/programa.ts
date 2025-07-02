import { IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity({ name: "programa" })
export class Programa extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "nombre", type: "varchar", nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;    
}