import { 
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToMany
} from "typeorm";
import { Clasificacion } from "./clasificacion";
import { Activo } from "./activos";
import { Material } from "./materiales";
import { EstadoInvGeneral } from "./estado-inv-general";
import { TipoArea } from "../../catalog/entities/tipo-area";
import { AreaDependencia } from "../../catalog/entities/area-dependencia";
import { TipoActivo } from "./tipo-activo";
import { Usuarios } from "../../auth/entities/usuarios";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Length, ValidateIf } from "class-validator";
import { Sedes } from "../../catalog/entities/sedes";
import { SeguimientoInventarioGeneral } from "./seguimiento-inventario-general";

@Entity("inventario_general")
export class InventarioGeneral extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "marca", type: "varchar", length: 150, nullable: true })
    @IsString()
    @IsOptional()
    @Length(1, 150, { message: "The asset name must be between 1 and 150 characters." })
    brand?: string;

    @Column({ name: "modelo", type: "varchar", length: 150, nullable: true })
    @IsString()
    @IsOptional()
    @Length(1, 150, { message: "The asset name must be between 1 and 150 characters." })
    model?: string;

    @Column({ name: "numero_serial", type: "varchar", length: 150, nullable: true })
    @IsString()
    @IsOptional()
    @Length(1, 150, { message: "The asset name must be between 1 and 150 characters." })
    serialNumber?: string;

    @Column({ name: "ubicacion", type: "varchar", length: 255 })
    @IsString()
    @Length(1, 255, { message: "The location must be between 1 and 255 characters." })
    location: string;

    @Column({ name: "cantidad", type: "int" })
    @IsNumber({}, { message: "Cantidad es obligatoria" })
    quantity: number;

    @Column({ name: "otros_detalles", type: "text" })
    @IsString()
    @IsNotEmpty({ message: "The other details are required." })
    otherDetails: string;

    @Column({ name: "fecha_adquisicion", type: "date", nullable: true })
    @IsDateString({}, { message: "Fecha de adquisicion es obligatoria" })
    acquisitionDate: Date;

    @Column({ name: "valor_compra", type: "bigint", nullable: true })
    @IsNumber({}, { message: "Valor de compra es obligatoria" })
    purchaseValue: number;

    @Column({ name: "garantia", type: "tinyint" })
    @IsBoolean()
    @IsNotEmpty({message: "Garantia es obligatoria"})
    warranty: boolean;

    @Column({ name: "tiempo_garantia", type: "varchar", length: 50, nullable: true })
    @ValidateIf((w) => w.warranty === true)
    @IsNotEmpty({ message: "Periodo de garantia es obligatoria"})
    @IsString()
    warrantyPeriod: string;

    @Column({ name: "numero_inventario", type: "varchar", length: 150, nullable: true })
    @IsNotEmpty({ message: "Numero de inventario es obligatorio"})
    @IsString()
    inventoryNumber: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @Column({ name: "id_clasificacion", type: "int" })
    @IsNumber({}, { message: "Clasificacion es obligatoria" })
    classificationId: number;

    @Column({ name: "id_activo", type: "int" })
    @IsNumber({}, { message: "Activo es obligatorio" })
    assetId: number;

    @Column({ name: "id_material", type: "int" })
    @IsNumber({}, { message: "Material es obligatorio" })
    materialId: number;

    @Column({ name: "id_estado", type: "int" })
    @IsNumber({}, { message: "Estado es obligatorio" })
    statusId: number;

    @Column({ name: "id_tipo_area", type: "int" })
    @IsNumber({}, { message: "Tipo de area es obligatorio" })
    areaTypeId: number;

    @Column({ name: "id_area_dependencia", type: "int" })
    @IsNumber({}, { message: "Area de dependencia es obligatoria" })
    dependencyAreaId: number;

    @Column({ name: "id_tipo_activo", type: "int" })
    @IsNumber({}, { message: "Tipo de activo es obligatorio" })
    assetTypeId: number;

    @Column({ name: "id_responsable", type: "int" })
    @IsNumber({}, { message: "Responsable es obligatorio" })
    responsibleId: number;

    @Column({ name: "sede_id", type: "int" })
    @IsNumber({}, { message: "Sede es obligatoria" })
    headquartersId: number;

    @Column({ name: "nombre", type: "varchar", length: 150 })
    @IsString()
    @Length(1, 150, { message: "The asset name must be between 1 and 150 characters." })
    name: string;

    // relaciones

    @ManyToOne(() => Clasificacion, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_clasificacion" })
    classificationRelation: Clasificacion;

    @ManyToOne(() => Activo, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_activo" })
    assetRelation: Activo;

    @ManyToOne(() => Material, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_material" })
    materialRelation: Material;

    @ManyToOne(() => EstadoInvGeneral, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_estado" })
    statusRelation: EstadoInvGeneral;

    @ManyToOne(() => Usuarios, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_responsable" })
    responsibleRelation: Usuarios;
    
    @ManyToOne(() => TipoArea, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_tipo_area" })
    areaTypeRelation: TipoArea;

    @ManyToOne(() => AreaDependencia, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_area_dependencia" })
    dependencyAreaRelation: AreaDependencia;

    @ManyToOne(() => TipoActivo, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_tipo_activo" })
    assetTypeRelation: TipoActivo;

    @ManyToOne(() => Sedes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "sede_id" })
    headquartersRelation: Sedes;

    @OneToMany(() => SeguimientoInventarioGeneral, (seguimiento) => seguimiento.item)
    seguimiento: SeguimientoInventarioGeneral[];
}