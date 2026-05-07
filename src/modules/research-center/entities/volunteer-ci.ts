import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "volunteer_ci" })
export class VolunteerCI extends BaseEntity {

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

    @Column({ name: "identification_type", type: "varchar", length: 3 })
    @IsNotEmpty({ message: "El tipo de identificación es requerido" })
    @IsString()
    identificationType: string;

    @Column({ name: "identification_number", type: "varchar", length: 20 })
    @IsNotEmpty({ message: "El número de identificación es requerido" })
    @IsString()
    identificationNumber: string;

    @Column({ name: "department", type: "varchar", length: 100 })
    @IsNotEmpty({ message: "El departamento es requerido" })
    @IsString()
    department: string;

    @Column({ name: "municipality", type: "varchar", length: 100 })
    @IsNotEmpty({ message: "El municipio es requerido" })
    @IsString()
    municipality: string;

    @Column({ name: "eps", type: "varchar", length: 80 })
    @IsNotEmpty({ message: "La EPS es requerida" })
    @IsString()
    eps: string;

    @Column({ name: "age", type: "varchar", length: 3 })
    @IsNotEmpty({ message: "La edad es requerida" })
    @IsString()
    age: string;

    @Column({ name: "nationality", type: "varchar", length: 50 })
    @IsNotEmpty({ message: "La nacionalidad es requerida" })
    @IsString()
    nationality: string;

    @Column({ name: "date", type: "date" })
    @IsNotEmpty({ message: "La fecha es requerida" })
    date: Date;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;
}
