import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AccesoriosEquipos } from "./accesorios-equipos";
import { seguimientoEquipos } from "./seguimiento-equipos";

@Entity({name: "equipos"})
export class Equipos extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "sede_id"})
    sedeId: number;

    @Column({name: "nombre_equipo"})
    name: string

    @Column({name: "ubicacion"})
    area: string

    @Column({name: "tipo_equipo"})
    typeEquipment: string

    @Column({name: "marca"})
    brand: string

    @Column({name: "modelo"})
    model: string

    @Column({name: "serial"})
    serial: string

    @Column({name: "sistema_operativo"})
    operatuingSystem: string

    @Column({name: "direccion_ip"})
    addressIp: string

    @Column({name: "mac"})
    mac: string

    @Column({name: "fecha_compra"})
    purchaseDate: Date

    @Column({name: "tiempo_garantia"})
    warrantyTime: number

    @Column({name: "garantia"})
    warranty: boolean

    @Column({name: "fecha_entrega"})
    deliveryDate: Date

    @Column({name: "numero_intentario"})
    inventoryNumber: string

    // relacion con accesorios equipo
    @OneToMany(() => AccesoriosEquipos, (accesorios) => accesorios.equipmentRelation)
    accessoriesRelation: AccesoriosEquipos[]

    @OneToMany(() => seguimientoEquipos, (seguimiento) => seguimiento.equipmentRelation)
    seguimientoEquipos: seguimientoEquipos[]
}