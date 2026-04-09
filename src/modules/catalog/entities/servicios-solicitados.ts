import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CupsRadicados } from "../../radicacion/entities";

@Entity("requested_services")
export class ServiciosSolicitados extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number;

    @Column({ name: "code", type: "varchar", length: 20 })
    @IsString()
    @IsNotEmpty({ message: "El código es requerido" })
    @Length(1, 10, { message: "El código debe tener entre $constraint1 y $constraint2 caracteres" })
    code: string;

    @Column({ name: "name", type: "varchar", length: 255 })
    @IsString()
    @IsNotEmpty({ message: "El nombre es requerido" })
    @Length(1, 150, { message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string;

    @Column({ name: "status", type: "tinyint", default: 1 })
    @IsBoolean()
    @IsNotEmpty({ message: "El estado es requerido" })
    status: boolean;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relacion con cups radicados
    @OneToMany(() => CupsRadicados, (cups) => cups.servicioRelation)
    cupsRadicadosRelation: CupsRadicados[]
}