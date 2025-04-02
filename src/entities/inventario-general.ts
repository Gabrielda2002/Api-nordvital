import { 
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm";
import { Clasificacion } from "./clasificacion";
import { Activo } from "./activos";
import { Material } from "./materiales";
import { EstadoInvGeneral } from "./estado-inv-general";
import { TipoArea } from "./tipo-area";
import { AreaDependencia } from "./area-dependencia";
import { TipoActivo } from "./tipo-activo";
import { Usuarios } from "./usuarios";
import { IsOptional, IsString, Length } from "class-validator";

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
    quantity: number;

    @Column({ name: "otros_detalles", type: "text" })
    otherDetails: string;

    @Column({ name: "fecha_adquisicion", type: "date", nullable: true })
    acquisitionDate: Date;

    @Column({ name: "valor_compra", type: "bigint", nullable: true })
    purchaseValue: number;

    @Column({ name: "garantia", type: "tinyint" })
    warranty: boolean;

    @Column({ name: "tiempo_garantia", type: "varchar", length: 50, nullable: true })
    warrantyPeriod: string;

    @Column({ name: "numero_inventario", type: "varchar", length: 150, nullable: true })
    inventoryNumber: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @Column({ name: "id_clasificacion", type: "int" })
    classificationId: number;

    @Column({ name: "id_activo", type: "int" })
    assetId: number;

    @Column({ name: "id_material", type: "int" })
    materialId: number;

    @Column({ name: "id_estado", type: "int" })
    statusId: number;

    @Column({ name: "id_tipo_area", type: "int" })
    areaTypeId: number;

    @Column({ name: "id_area_dependencia", type: "int" })
    dependencyAreaId: number;

    @Column({ name: "id_tipo_activo", type: "int" })
    assetTypeId: number;

    @Column({ name: "id_responsable", type: "int" })
    responsibleId: number;

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
}