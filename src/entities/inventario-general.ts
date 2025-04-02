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

@Entity("inventario_general")
export class InventarioGeneral extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Clasificacion, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_clasificacion" })
    clasificacion: Clasificacion;

    @ManyToOne(() => Activo, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_activo" })
    activo: Activo;

    @Column({ type: "varchar", length: 150, nullable: true })
    marca: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    modelo: string;

    @ManyToOne(() => Material, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_material" })
    material: Material;

    @Column({ type: "varchar", length: 150, nullable: true })
    numero_serial: string;

    @ManyToOne(() => EstadoInvGeneral, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_estado" })
    estado: EstadoInvGeneral;

    @ManyToOne(() => TipoArea, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_tipo_area" })
    tipoArea: TipoArea;

    @ManyToOne(() => AreaDependencia, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_area_dependencia" })
    areaDependencia: AreaDependencia;

    @Column({ type: "varchar", length: 255 })
    ubicacion: string;

    @ManyToOne(() => TipoActivo, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_tipo_activo" })
    tipoActivo: TipoActivo;

    @Column({ type: "int" })
    cantidad: number;

    @ManyToOne(() => Usuarios, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_responsable" })
    responsable: Usuarios;

    @Column({ type: "text" })
    otrosDetalles: string;

    @Column({ type: "date", nullable: true })
    fechaAdquisicion: Date;

    @Column({ type: "bigint", nullable: true })
    valorCompra: number;

    @Column({ type: "tinyint" })
    garantia: boolean;

    @Column({ type: "varchar", length: 50, nullable: true })
    tiempoGarantia: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    numeroInventario: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}