import { 
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToMany 
} from "typeorm";
import { InventarioGeneral } from "./inventario-general";
import { Activo } from "./activos";

@Entity("clasificacion")
export class Clasificacion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 150 })
    nombre: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => InventarioGeneral, (inventario) => inventario.clasificacion)
    inventarios: InventarioGeneral[];

    @OneToMany(() => Activo, (activo) => activo.clasificacion)
    activos: Activo[];
}
