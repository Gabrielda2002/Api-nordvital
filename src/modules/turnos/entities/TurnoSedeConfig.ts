import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { Sedes } from "../../catalog/entities/sedes";

@Entity("turno_sedes_config")
export class TurnoSedeConfig extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "headquarter_id", type: "int" })
  @IsNotEmpty({ message: "La sede es requerida" })
  @IsInt({ message: "El ID de sede debe ser un entero" })
  headquarterId: number;

  @Column({ name: "slug", type: "varchar", length: 100, unique: true })
  @IsNotEmpty({ message: "El slug de la sede es requerido" })
  @IsString()
  @Length(2, 100, { message: "El slug debe tener entre 2 y 100 caracteres" })
  slug: string;

  @Column({ name: "latitude", type: "decimal", precision: 10, scale: 8 })
  @IsNotEmpty({ message: "La latitud es requerida" })
  @IsNumber({}, { message: "La latitud debe ser un valor numérico" })
  @Min(-90)
  @Max(90)
  latitude: number;

  @Column({ name: "longitude", type: "decimal", precision: 11, scale: 8 })
  @IsNotEmpty({ message: "La longitud es requerida" })
  @IsNumber({}, { message: "La longitud debe ser un valor numérico" })
  @Min(-180)
  @Max(180)
  longitude: number;

  @Column({ name: "geo_radius_meters", type: "int", default: 150 })
  @IsOptional()
  @IsInt({ message: "El radio de tolerancia debe ser un entero en metros" })
  @Min(10)
  geoRadiusMeters: number;

  @Column({ name: "is_enabled", type: "tinyint", width: 1, default: 1 })
  @IsOptional()
  @IsBoolean()
  isEnabled: boolean;

  @Column({ name: "average_service_minutes", type: "int", default: 10 })
  @IsOptional()
  @IsInt({ message: "El tiempo promedio debe ser un entero en minutos" })
  @Min(1)
  averageServiceMinutes: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Sedes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "headquarter_id" })
  headquarter: Sedes;
}

