import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LugarRadicacion } from "./lugar-radicacion";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { SeguimientoDispositivosRed } from "./seguimiento-dispositivos-red";

@Entity({name: "dispositivos_red"})
export class dispositivosRed extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "sede_id"})
    @IsNumber()
    @IsNotEmpty({message: "La sede es requerida"})
    sedeId: number

    @Column({name: "nombre"})
    @IsString()
    @IsNotEmpty({message: "El nombre del dispositivo es requerido"})
    @Length(3, 200, {message: "El nombre del dispositivo debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "marca"})
    @IsString()
    @IsNotEmpty({message: "La marca es requerida"})
    @Length(3, 200, {message: "La marca debe tener entre $constraint1 y $constraint2 caracteres"})
    brand: string

    @Column({name: "modelo"})
    @IsString()
    @IsNotEmpty({message: "El modelo es requerido"})
    @Length(3, 200, {message: "El modelo debe tener entre $constraint1 y $constraint2 caracteres"})
    model: string

    @Column({name: "serial"})
    @IsString()
    @IsNotEmpty({message: "El serial es requerido"})
    @Length(3, 200, {message: "El serial debe tener entre $constraint1 y $constraint2 caracteres"})
    serial: string

    @Column({name: "direccion_ip"})
    @IsString()
    @IsNotEmpty({message: "La dirección ip es requerida"})
    @Length(3, 200, {message: "La dirección ip debe tener entre $constraint1 y $constraint2 caracteres"})
    addressIp: string

    @Column({name: "mac"})
    @IsString()
    @IsNotEmpty({message: "La mac es requerida"})
    @Length(3, 200, {message: "La mac debe tener entre $constraint1 y $constraint2 caracteres"})
    mac: string

    @Column({name: "otros_datos"})
    @IsString()
    @IsNotEmpty({message: "Otros datos son requeridos"})
    @Length(3, 200, {message: "Los otros datos deben tener entre $constraint1 y $constraint2 caracteres"})
    otherData: string

    @Column({name: "estado"})
    @IsString()
    @IsNotEmpty({message: "El estado es requerido"})
    @Length(3, 200, {message: "El estado debe tener entre $constraint1 y $constraint2 caracteres"})
    status: string

    @Column({name: "numero_inventario"})
    @IsString()
    @IsNotEmpty({message: "El número de inventario es requerido"})
    @Length(3, 200, {message: "El número de inventario debe tener entre $constraint1 y $constraint2 caracteres"})
    inventoryNumber: string

    // relacion con lugar radicacion
    @ManyToOne(() => LugarRadicacion, (lugar) => lugar.devicesRelation)
    @JoinColumn({name: "sede_id"})
    placeRelation: LugarRadicacion

    // releacion con seguimiento dispositivos red
    @OneToMany(() => SeguimientoDispositivosRed, (seguimiento) => seguimiento.deviceRelation)
    seguimientoDispositivosRedRelation: SeguimientoDispositivosRed[]

}