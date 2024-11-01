import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator"
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({name: "accesorios_equipos"})
export class AccesoriosEquipos extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number

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
}