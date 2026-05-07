import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "contact_ci" })
export class ContactCI extends BaseEntity {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", type: "varchar" })
    @IsNotEmpty({ message: "El nombre es requerido" })
    @IsString()
    @Length(2, 100, { message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string;

    @Column({ name: "lastname", type: "varchar" })
    @IsNotEmpty({ message: "El apellido es requerido" })
    @IsString()
    @Length(2, 100, { message: "El apellido debe tener entre $constraint1 y $constraint2 caracteres" })
    lastname: string;

    @Column({ name: "phone", type: "varchar", length: 20 })
    @IsNotEmpty({ message: "El teléfono es requerido" })
    @IsString()
    phone: string;

    @Column({ name: "email", type: "varchar", length: 150 })
    @IsNotEmpty({ message: "El email es requerido" })
    @IsEmail({}, { message: "El email no es válido" })
    email: string;

    @Column({ name: "subject", type: "varchar", length: 50 })
    @IsNotEmpty({ message: "El asunto es requerido" })
    @IsString()
    subject: string;

    @Column({ name: "description", type: "text" })
    @IsNotEmpty({ message: "La descripción es requerida" })
    @IsString()
    description: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;
}
