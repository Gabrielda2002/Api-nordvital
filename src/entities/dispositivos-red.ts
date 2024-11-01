import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LugarRadicacion } from "./lugar-radicacion";

@Entity({name: "dispositivos_red"})
export class dispositivosRed extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "sede_id"})
    sedeId: number

    @Column({name: "nombre"})
    name: string

    @Column({name: "marca"})
    brand: string

    @Column({name: "modelo"})
    model: string

    @Column({name: "serial"})
    serial: string

    @Column({name: "direccion_ip"})
    addressIp: string

    @Column({name: "mac"})
    mac: string

    @Column({name: "otros_datos"})
    otherData: string

    @Column({name: "estado"})
    status: string

    @Column({name: "numero_inventario"})
    inventoryNumber: string

    // relacion con lugar radicacion
    @ManyToOne(() => LugarRadicacion, (lugar) => lugar.devicesRelation)
    @JoinColumn({name: "sede_id"})
    placeRelation: LugarRadicacion

}