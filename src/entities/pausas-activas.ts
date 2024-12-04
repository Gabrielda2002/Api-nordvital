import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";

@Entity({ name: "pausas_activas" })
export class PausasActivas extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "observacion", type: "text", nullable: true })
    @IsString()
    @Length(1, 200, { message: "La observación debe tener entre $constraint1 y $constraint2 caracteres" })
    observation: string;

    @Column({ name: "usuario_id", type: "int" })
    @IsInt()
    @IsNotEmpty({ message: "El id del usuario es requerido" })  
    userId: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @ManyToOne(() => Usuarios, (usuario) => usuario.activeBrakesRelation)
    @JoinColumn({ name: "usuario_id" })
    userRelation: Usuarios;

}