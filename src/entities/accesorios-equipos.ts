import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator"
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Equipos } from "./equipos"

@Entity({name: "accesorios_equipos"})
export class AccesoriosEquipos extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "equipo_id "})
    sedeId: number

    @Column({name: "nombre"})
    @IsString()
    @IsNotEmpty({message: "El nombre del accesorio es requerido"})
    @Length(3, 50, {message: "El nombre del accesorio debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "marca"})
    brand: string

    @Column({name: "modelo"})
    model: string

    @Column({name: "serial"})
    serial: string

    @Column({name: "otros_datos"})
    otherData: string

    @Column({name: "estado"})
    status: string

    @Column({name: "numero_inventario"})
    inventoryNumber: string

    @ManyToOne(() => Equipos, equipment => equipment.accessoriesRelation)
    @JoinColumn({name: "equipo_id"})
    equipmentRelation: Equipos

}