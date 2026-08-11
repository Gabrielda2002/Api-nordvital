import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("pqrsdf_risk_policies")
export class PqrsdfRiskPolicy extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number;

    @Column({ name: "code", type: "varchar", length: 50, unique: true, comment: "Código estable de la política de riesgo (e.g. VITAL, PRIORIZADO)" })
    @IsString()
    @IsNotEmpty()
    code: string;

    @Column({ name: "name", type: "varchar", length: 100, comment: "Nombre descriptivo de la política de riesgo" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column({ name: "sla_duration_value", type: "int", comment: "Valor numérico de la duración SLA" })
    @IsNumber()
    @IsNotEmpty()
    slaDurationValue: number;

    @Column({ name: "sla_duration_unit", type: "enum", enum: ["HOURS", "DAYS"], comment: "Unidad de la duración SLA" })
    @IsNotEmpty()
    @IsEnum(["HOURS", "DAYS"])
    slaDurationUnit: "HOURS" | "DAYS";

    @Column({ name: "business_days", type: "tinyint", width: 1, default: 0, comment: "Si el SLA se mide en días hábiles (0=NO, 1=SÍ). Deshabilitado por ahora." })
    @IsNotEmpty()
    @IsBoolean()
    businessDays: boolean;

    @Column({ name: "active", type: "tinyint", width: 1, default: 1, comment: "Si la política está activa (1) o inactiva (0)" })
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
