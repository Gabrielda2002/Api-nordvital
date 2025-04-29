import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'participantes'})
export class Participantes extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'nombres' ,type: "varchar", length: 100 })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column({name: 'apellidos' ,type: "varchar", length: 100 })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @Column({name: 'tipo_documento' ,type: "varchar", length: 10 })
    @IsString()
    @IsNotEmpty()
    typeDocument: string;

    @Column({name: 'numero_documento' ,type: "varchar", length: "20", unique: true })
    @IsString()
    @IsNotEmpty()
    documentNumber: string;

    @Column({name: 'profesion' ,type: "varchar", length: 150 })
    @IsString()
    @IsNotEmpty()
    profession: string;

    @Column({name: 'empresa' ,type: "varchar", length: 100 })
    @IsString()
    @IsNotEmpty()
    company: string;

    @Column({name: 'correo' ,type: "varchar", length: 100, unique: true })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @Column({name: 'telefono' ,type: "varchar", length: 15 })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @Column({name: 'ciudad' ,type: "varchar", length: 50 })
    city: string;
    
    @Column({name: 'departamento' ,type: "varchar", length: 50 })
    @IsString()
    @IsNotEmpty()
    department: string;

    @Column({name: 'pais' ,type: "varchar", length: 50 })
    country: string;

    @Column({name: 'direccion' ,type: "varchar", length: 150 })
    @IsString()
    @IsNotEmpty()
    address: string;

    @Column({name: 'tipo_participante' ,type: "varchar", length: 50 })
    typeParticipant: string;

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}