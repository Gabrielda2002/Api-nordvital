import { IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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