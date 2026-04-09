import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CupsRadicados } from "../../radicacion/entities";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity("functional_units")
export class UnidadFuncional extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number;

    @Column({ name: "name", type: "varchar", length: 255 })
    @IsString()
    @IsNotEmpty({ message: "El nombre de la unidad funcional es requerido" })
    @Length(3, 50, { message: "El nombre de la unidad funcional debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string;

    @Column({ name: "status", type: "tinyint", default: 1 })
    @IsBoolean()
    status: boolean;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => CupsRadicados, (cupsradicados) => cupsradicados.functionalUnitRelation)
    cupsRadicadosRelation: CupsRadicados[]


}