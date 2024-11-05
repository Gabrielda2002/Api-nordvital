import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LugarRadicacion } from "./lugar-radicacion";
import { IsString, Length } from "class-validator";

@Entity("departamentos")
export class departamentos extends BaseEntity{

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "nombre"})
    @IsString()
    @Length(3, 50, {message: "El nombre del departamento debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    // relacion con sedes
    @ManyToOne(() => LugarRadicacion, (lugar) => lugar.departmentRelation)
    placeRelation: LugarRadicacion[];

}