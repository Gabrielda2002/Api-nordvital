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
import { Length } from "class-validator";

@Entity("activos")
export class Activo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 150 })
    @Length(1, 150, { message: "El nombre del activo debe tener entre 1 y 150 caracteres." })
    name : string;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
    
    @OneToMany(() => InventarioGeneral, (inventario) => inventario.assetRelation)
    inventarios: InventarioGeneral[];
    
        @ManyToOne(() => Clasificacion, (clasificacion) => clasificacion.activos, { onDelete: "CASCADE" })
        @JoinColumn({ name: "id_clasificacion" })
        clasificacion: Clasificacion;
    
}
