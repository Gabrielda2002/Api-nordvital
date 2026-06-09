import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";
import { IsNotEmpty, IsString, Length } from "class-validator";

@Entity("rol")
export class Roles extends BaseEntity {

    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'name'})
    @IsNotEmpty({message: 'El nombre del rol es requerido'})
    @IsString()
    @Length(3, 50, {message: 'El nombre del rol debe tener entre $constraint1 y $constraint2 caracteres'})
    name: string;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones
    @OneToMany(() => Usuarios, (usuarios) => usuarios.rolesRelation)
    usuarioRelation: Usuarios[]
}