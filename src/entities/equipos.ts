import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { AccesoriosEquipos } from "./accesorios-equipos";
import { seguimientoEquipos } from "./seguimiento-equipos";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Componentes } from "./componentes";
import { Software } from "./software";
import { Usuarios } from "./usuarios";

@Entity({name: "equipos"})
export class Equipos extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "sede_id"})
    @IsNumber()
    @IsNotEmpty({message: "La sede es requerida"})
    sedeId: number;

    @Column({name: "nombre_equipo"})
    @IsString()
    @IsNotEmpty({message: "El nombre del equipo es requerido"})
    @Length(3, 200, {message: "El nombre del equipo debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "ubicacion"})
    @IsString()
    @IsNotEmpty({message: "La ubicación es requerida"})
    @Length(3, 200, {message: "La ubicación debe tener entre $constraint1 y $constraint2 caracteres"})
    area: string

    @Column({name: "tipo_equipo"})
    @IsString()
    @IsNotEmpty({message: "El tipo de equipo es requerido"})
    @Length(3, 200, {message: "El tipo de equipo debe tener entre $constraint1 y $constraint2 caracteres"})
    typeEquipment: string

    @Column({name: "marca"})
    @IsString()
    @IsNotEmpty({message: "La marca es requerida"})
    @Length(2, 200, {message: "La marca debe tener entre $constraint1 y $constraint2 caracteres"})
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

    @Column({name: "sistema_operativo"})
    @IsString()
    @IsNotEmpty({message: "El sistema operativo es requerido"})
    @Length(3, 200, {message: "El sistema operativo debe tener entre $constraint1 y $constraint2 caracteres"})
    operationalSystem: string

    @Column({name: "direccion_ip", nullable: true})
    @IsString()
    @IsOptional({message: "La dirección ip es opcional"})
    @Length(3, 200, {message: "La dirección ip debe tener entre $constraint1 y $constraint2 caracteres"})
    addressIp: string

    @Column({name: "mac"})
    @IsString()
    @IsNotEmpty({message: "La mac es requerida"})
    @Length(3, 200, {message: "La mac debe tener entre $constraint1 y $constraint2 caracteres"})
    mac: string

    @Column({name: "fecha_compra"})
    @IsNotEmpty({message: "La fecha de compra es requerida"})
    purchaseDate: Date

    @Column({name: "tiempo_garantia"})
    @IsString()
    @IsNotEmpty({message: "El tiempo de garantía es requerido"})
    @Length(3, 200, {message: "El tiempo de garantía debe tener entre $constraint1 y $constraint2 caracteres"})
    warrantyTime: string

    @Column({name: "garantia"})
    @IsNotEmpty({message: "La garantía es requerida"})
    @IsBoolean()
    warranty: boolean

    @Column({name: "fecha_entrega"})
    @IsNotEmpty({message: "La fecha de entrega es requerida"})
    deliveryDate: Date

    @Column({name: "numero_intentario"})
    @IsString()
    @IsNotEmpty({message: "El número de inventario es requerido"})
    @Length(3, 200, {message: "El número de inventario debe tener entre $constraint1 y $constraint2 caracteres"})
    inventoryNumber: string

    @Column({name: "DHCP", nullable: true})
    @IsBoolean()
    dhcp: boolean;

    @Column({name: "id_usuario", nullable: true})
    @IsInt()
    idUsuario: number;

    @CreateDateColumn({name: "fecha_creacion"})
    createAt: Date

    @UpdateDateColumn({name: "fecha_actualizacion"})
    updateAt: Date

    // relacion con accesorios equipo
    @OneToMany(() => AccesoriosEquipos, (accesorios) => accesorios.equipmentRelation)
    accessoriesRelation: AccesoriosEquipos[]

    @OneToMany(() => seguimientoEquipos, (seguimiento) => seguimiento.equipmentRelation)
    seguimientoEquipos: seguimientoEquipos[]

    // relacion con componente
    @OneToMany(() => Componentes, (component) => component.equipmentsRelation)
    componentRelation: Componentes[]

    //relacion con software
    @OneToMany(() => Software, (software) => software.equipmentRelation)
    softwareRelation: Software[]

    // relacion con usuarios
    @ManyToOne(() => Usuarios, usuarios => usuarios.equipmentRelation)
    @JoinColumn({ name: "id_usuario" })
    userRelation: Usuarios;
}