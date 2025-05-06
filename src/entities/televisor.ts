import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { LugarRadicacion } from "./lugar-radicacion";
import { Usuarios } from "./usuarios";
import { Soportes } from "./soportes";
import { SeguimientoTelevisor } from "./seguimiento-televisor";

@Entity({name: "televisores"})
export class Televisor extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "sede_id"})
    @IsNumber()
    @IsNotEmpty({message: "La sede es requerida"})
    sedeId: number;

    @Column({name: "nombre"})
    @IsString()
    @IsNotEmpty({message: "El nombre del televisor es requerido"})
    @Length(3, 255, {message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string;

    @Column({name: "ubicacion"})
    @IsString()
    @IsNotEmpty({message: "La ubicación es requerida"})
    @Length(3, 255, {message: "La ubicación debe tener entre $constraint1 y $constraint2 caracteres"})
    location: string;

    @Column({name: "marca"})
    @IsString()
    @IsNotEmpty({message: "La marca es requerida"})
    @Length(2, 255, {message: "La marca debe tener entre $constraint1 y $constraint2 caracteres"})
    brand: string;

    @Column({name: "modelo"})
    @IsString()
    @IsNotEmpty({message: "El modelo es requerido"})
    @Length(3, 255, {message: "El modelo debe tener entre $constraint1 y $constraint2 caracteres"})
    model: string;

    @Column({name: "serial"})
    @IsString()
    @IsNotEmpty({message: "El serial es requerido"})
    @Length(3, 255, {message: "El serial debe tener entre $constraint1 y $constraint2 caracteres"})
    serial: string;

    @Column({name: "pulgadas"})
    @IsInt()
    @IsNotEmpty({message: "Las pulgadas son requeridas"})
    pulgadas: number;

    @Column({name: "tipo_pantalla"})
    @IsString()
    @IsNotEmpty({message: "El tipo de pantalla es requerido"})
    @Length(2, 100, {message: "El tipo de pantalla debe tener entre $constraint1 y $constraint2 caracteres"})
    screenType: string;

    @Column({name: "smart_tv"})
    @IsBoolean()
    @IsNotEmpty({message: "Debe especificar si es un Smart TV"})
    smartTv: boolean;

    @Column({name: "sistema_operativo", nullable: true})
    @IsString()
    @IsOptional()
    @Length(2, 255, {message: "El sistema operativo debe tener entre $constraint1 y $constraint2 caracteres"})
    operativeSystem: string;

    @Column({name: "direccion_ip", nullable: true})
    @IsString()
    @IsOptional()
    @Length(7, 20, {message: "La dirección IP debe tener entre $constraint1 y $constraint2 caracteres"})
    addressIp: string;

    @Column({name: "mac", nullable: true})
    @IsString()
    @IsOptional()
    @Length(12, 17, {message: "La dirección MAC debe tener entre $constraint1 y $constraint2 caracteres"})
    mac: string;

    @Column({name: "resolucion"})
    @IsString()
    @IsNotEmpty({message: "La resolución es requerida"})
    @Length(2, 100, {message: "La resolución debe tener entre $constraint1 y $constraint2 caracteres"})
    resolution: string;

    @Column({name: "num_puertos_hdmi", nullable: true})
    @IsInt()
    @IsOptional()
    numPuertosHdmi: number;

    @Column({name: "num_puertos_usb", nullable: true})
    @IsInt()
    @IsOptional()
    numPuertosUsb: number;

    @Column({name: "conectividad", nullable: true})
    @IsString()
    @IsOptional()
    @Length(2, 255, {message: "La conectividad debe tener entre $constraint1 y $constraint2 caracteres"})
    connectivity: string;

    @Column({name: "fecha_compra"})
    @IsDate()
    @IsNotEmpty({message: "La fecha de compra es requerida"})
    purchaseDate: Date;

    @Column({name: "tiempo_garantia"})
    @IsString()
    @IsNotEmpty({message: "El tiempo de garantía es requerido"})
    @Length(2, 100, {message: "El tiempo de garantía debe tener entre $constraint1 y $constraint2 caracteres"})
    warrantyTime: string;

    @Column({name: "garantia"})
    @IsBoolean()
    @IsNotEmpty({message: "La garantía es requerida"})
    warranty: boolean;

    @Column({name: "fecha_entrega"})
    @IsDate()
    @IsNotEmpty({message: "La fecha de entrega es requerida"})
    deliveryDate: Date;

    @Column({name: "numero_inventario"})
    @IsString()
    @IsNotEmpty({message: "El número de inventario es requerido"})
    @Length(3, 255, {message: "El número de inventario debe tener entre $constraint1 y $constraint2 caracteres"})
    inventoryNumber: string;

    // @Column({name: "area_responsable"})
    // @IsString()
    // @IsNotEmpty({message: "El área responsable es requerida"})
    // @Length(3, 255, {message: "El área responsable debe tener entre $constraint1 y $constraint2 caracteres"})
    // areaResponsable: string;

    @Column({name: "id_responsable", nullable: true})
    @IsInt()
    @IsOptional()
    idResponsable: number;

    @Column({name: "acta_id", nullable: true})
    @IsInt()
    @IsOptional()
    actaId: number;

    @Column({name: "observaciones", nullable: true})
    @IsString()
    @IsOptional()
    observation: string;

    @Column({name: "estado"})
    @IsString()
    @IsNotEmpty({message: "El estado es requerido"})
    @Length(2, 100, {message: "El estado debe tener entre $constraint1 y $constraint2 caracteres"})
    status: string;

    @Column({name: "valor_adquisicion", type: "decimal", precision: 12, scale: 2, nullable: true})
    @IsNumber()
    @IsOptional()
    acquisitionValue: number;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    // Relaciones
    @ManyToOne(() => LugarRadicacion, sede => sede.televisoresRelation)
    @JoinColumn({ name: "sede_id" })
    sedeRelation: LugarRadicacion;

    @ManyToOne(() => Usuarios, usuario => usuario.televisoresRelation)
    @JoinColumn({ name: "id_responsable" })
    responsableRelation: Usuarios;

    @ManyToOne(() => Soportes, soportes => soportes.televisoresRelation)
    @JoinColumn({ name: "acta_id" })
    actaRelation: Soportes;

    @OneToMany(() => SeguimientoTelevisor, seguimiento => seguimiento.televisorRelation)
    seguimientoRelation: SeguimientoTelevisor[];
}