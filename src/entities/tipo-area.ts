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
import { Length } from "class-validator";

@Entity("tipo_area")
export class TipoArea extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 150 })
    @Length(1, 150, {  message: "El nombre debe tener entre 1 y 150 caracteres." })
    name: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => InventarioGeneral, (inventario) => inventario.areaTypeRelation)
    inventarios: InventarioGeneral[];
}
