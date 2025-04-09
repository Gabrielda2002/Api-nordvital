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

@Entity("tipo_activo")
export class TipoActivo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 150 })
    name: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => InventarioGeneral, (inventario) => inventario.assetTypeRelation)
    inventarios: InventarioGeneral[];
}
