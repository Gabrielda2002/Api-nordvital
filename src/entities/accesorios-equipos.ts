import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator"
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Equipos } from "./equipos"

@Entity({name: "accesorios_equipos"})
export class AccesoriosEquipos extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "equipo_id"})
    equipmentId: number

    @Column({name: "nombre"})
    @IsString()
    @IsNotEmpty({message: "El nombre del accesorio es requerido"})
    @Length(3, 255, {message: "El nombre del accesorio debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "marca"})
    @IsString()
    @IsNotEmpty({message: "La marca del accesorio es requerida"})
    @Length(2, 255, {message: "La marca del accesorio debe tener entre $constraint1 y $constraint2 caracteres"})
    brand: string

    @Column({name: "modelo"})
    @IsString()
    @IsNotEmpty({message: "El modelo del accesorio es requerido"})
    model: string

    @Column({name: "serial"})
    @IsString()
    @IsNotEmpty({message: "El serial del accesorio es requerido"})
    @Length(3, 255, {message: "El serial del accesorio debe tener entre $constraint1 y $constraint2 caracteres"})
    serial: string

    @Column({name: "otros_datos"})
    @IsString()
    @IsNotEmpty({message: "Otros datos del accesorio son requeridos"})
    @Length(3, 255, {message: "Los otros datos del accesorio deben tener entre $constraint1 y $constraint2 caracteres"})
    otherData: string

    @Column({name: "estado"})
    @IsString()
    @IsNotEmpty({message: "El estado del accesorio es requerido"})
    @Length(3, 255, {message: "El estado del accesorio debe tener entre $constraint1 y $constraint2 caracteres"})
    status: string

    @Column({name: "numero_inventario"})
    @IsString()
    @IsNotEmpty({message: "El número de inventario del accesorio es requerido"})
    @Length(3, 255, {message: "El número de inventario del accesorio debe tener entre $constraint1 y $constraint2 caracteres"})
    inventoryNumber: string

    @CreateDateColumn({name: "created_at"})
    createdAt: Date

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date

    @ManyToOne(() => Equipos, equipment => equipment.accessoriesRelation)
    @JoinColumn({name: "equipo_id"})
    equipmentRelation: Equipos

}