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

@Entity({ name: "tipo_demanda_inducida" })
export class TipoDemandaInducida extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 60 })
    @IsString()
    @IsNotEmpty({ message: "El nombre del tipo es requerido" })
    @Length(1, 60, { message: "El nombre debe tener entre 1 y 60 caracteres" })
    nombre: string;

    @Column({ name: "activo", type: "tinyint", default: 1 })
    @IsBoolean()
    @IsOptional()
    activo: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // Relaciones
    @OneToMany(() => DemandaInducida, (demandaInducida) => demandaInducida.tipoRelation)
    demandaInducidaRelation: DemandaInducida[];
}
