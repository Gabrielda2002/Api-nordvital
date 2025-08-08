import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { Programa } from "./programa";
import { LugarRadicacion } from "./lugar-radicacion";

@Entity({ name: "programa_meta_historico" })
export class ProgramaMetaHistorico extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "programa_id", type: "int", nullable: false })
    programaId: number;

    @Column({ name: "meta", type: "int", nullable: false })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty({ message: "La meta es requerida" })
    meta: number;

    @Column({ name: "año", type: "int", nullable: false })
    @IsNumber()
    @IsNotEmpty({ message: "El año es requerido" })
    año: number;

    @Column({ name: "mes", type: "int", nullable: false })
    @IsNumber()
    @IsNotEmpty({ message: "El mes es requerido" })
    mes: number; // 1-12

    @Column({ name: "activo", type: "boolean", default: true })
    activo: boolean;

    @Column({ name: "profesional", type: "enum", enum: ['Medicina General', 'Enfermería', 'Nutrición', 'Ginecobstetricia', 'Psicología'], default: 'Medicina General' })
    professional: 'Medicina General' | 'Enfermería' | 'Nutrición' | 'Ginecobstetricia' | 'Psicología';

    @Column({ name: "sede_id", type: "int", nullable: false, default: 1 })
    @IsNumber()
    @IsNotEmpty({ message: "La sede es requerida" })
    headquartersId: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // Relaciones
    @ManyToOne(() => Programa, (programa) => programa.metaHistoricoRelation)
    @JoinColumn({ name: "programa_id" })
    programaRelation: Programa;

    @ManyToOne(() => LugarRadicacion, (sede) => sede.programaMetaHistoricoRelation)
    @JoinColumn({ name: "sede_id" })
    headquartersRelation: LugarRadicacion;
}