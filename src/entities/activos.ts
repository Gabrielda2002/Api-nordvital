import { 
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    JoinColumn, 
    OneToMany 
} from "typeorm";
import { Clasificacion } from "./clasificacion";
import { InventarioGeneral } from "./inventario-general";

@Entity("activos")
export class Activo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 150 })
    nombre: string;

    @ManyToOne(() => Clasificacion, (clasificacion) => clasificacion.activos, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_clasificacion" })
    clasificacion: Clasificacion;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => InventarioGeneral, (inventario) => inventario.activo)
    inventarios: InventarioGeneral[];
}
