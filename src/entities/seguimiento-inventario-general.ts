import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";
import { InventarioGeneral } from "./inventario-general";

@Entity("seguimiento_inventario_general")
export class SeguimientoInventarioGeneral extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "item_id"})
    itemId: number;

    @Column({ name: "fecha_evento" ,type: 'date' })
    fecha_evento: Date;

    @Column({name: "tipo_evento", length: 200 })
    typeEvent: string;

    @Column({ name: "descripcion" , type: 'text' })
    description: string;

    @Column({name: "responsable"})
    responsable: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => InventarioGeneral, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: InventarioGeneral;

    @ManyToOne(() => Usuarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'responsable' })
    usuario: Usuarios;
}