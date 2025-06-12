import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { DemandaInducida } from "./demanda-inducida";

@Entity({ name: "area_persona_seguimiento" })
export class AreaPersonaSeguimiento extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 40 })
    @IsString()
    @IsNotEmpty({ message: "El nombre del área es requerido" })
    @Length(1, 40, { message: "El nombre debe tener entre 1 y 40 caracteres" })
    name: string;

    @Column({ name: "activo", type: "tinyint", default: 1 })
    @IsBoolean()
    @IsOptional()
    status: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // Relaciones
    @OneToMany(() => DemandaInducida, (demandaInducida) => demandaInducida.areaPersonaRelation)
    demandaInducidaRelation: DemandaInducida[];
}
