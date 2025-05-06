import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { LugarRadicacion } from "./lugar-radicacion";
import { Usuarios } from "./usuarios";
import { Soportes } from "./soportes";
import { SeguimientoCelular } from "./seguimiento-celular";

@Entity({name: "celulares"})
export class Celular extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "sede_id"})
    @IsNumber()
    @IsNotEmpty({message: "La sede es requerida"})
    sedeId: number;

    @Column({name: "nombre"})
    @IsString()
    @IsNotEmpty({message: "El nombre del celular es requerido"})
    @Length(3, 255, {message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string;

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

    @Column({name: "imei"})
    @IsString()
    @IsNotEmpty({message: "El IMEI es requerido"})
    @Length(15, 17, {message: "El IMEI debe tener entre $constraint1 y $constraint2 caracteres"})
    imei: string;

    @Column({name: "sistema_operativo"})
    @IsString()
    @IsNotEmpty({message: "El sistema operativo es requerido"})
    @Length(2, 100, {message: "El sistema operativo debe tener entre $constraint1 y $constraint2 caracteres"})
    sistemaOperativo: string;

    @Column({name: "version_so", nullable: true})
    @IsString()
    @IsOptional()
    @Length(1, 50, {message: "La versión del SO debe tener entre $constraint1 y $constraint2 caracteres"})
    versionSO: string;

    @Column({name: "capacidad_almacenamiento"})
    @IsString()
    @IsNotEmpty({message: "La capacidad de almacenamiento es requerida"})
    @Length(2, 50, {message: "La capacidad de almacenamiento debe tener entre $constraint1 y $constraint2 caracteres"})
    capacidadAlmacenamiento: string;

    @Column({name: "capacidad_ram"})
    @IsString()
    @IsNotEmpty({message: "La capacidad RAM es requerida"})
    @Length(2, 50, {message: "La capacidad RAM debe tener entre $constraint1 y $constraint2 caracteres"})
    capacidadRAM: string;

    @Column({name: "numero_telefonico", nullable: true})
    @IsString()
    @IsOptional()
    @Length(7, 20, {message: "El número telefónico debe tener entre $constraint1 y $constraint2 caracteres"})
    numeroTelefonico: string;

    @Column({name: "operador", nullable: true})
    @IsString()
    @IsOptional()
    @Length(2, 100, {message: "El operador debe tener entre $constraint1 y $constraint2 caracteres"})
    operador: string;

    @Column({name: "tipo_plan", nullable: true})
    @IsString()
    @IsOptional()
    @Length(2, 100, {message: "El tipo de plan debe tener entre $constraint1 y $constraint2 caracteres"})
    tipoPlan: string;

    @Column({name: "fecha_vencimiento_plan", nullable: true})
    @IsDate()
    @IsOptional()
    fechaVencimientoPlan: Date;

    @Column({name: "mac_wifi", nullable: true})
    @IsString()
    @IsOptional()
    @Length(12, 17, {message: "La dirección MAC Wi-Fi debe tener entre $constraint1 y $constraint2 caracteres"})
    macWifi: string;

    @Column({name: "direccion_bluetooth", nullable: true})
    @IsString()
    @IsOptional()
    @Length(12, 17, {message: "La dirección Bluetooth debe tener entre $constraint1 y $constraint2 caracteres"})
    direccionBluetooth: string;

    @Column({name: "id_corporativo", nullable: true})
    @IsString()
    @IsOptional()
    @Length(3, 255, {message: "El ID corporativo debe tener entre $constraint1 y $constraint2 caracteres"})
    idCorporativo: string;

    @Column({name: "fecha_compra"})
    @IsDate()
    @IsNotEmpty({message: "La fecha de compra es requerida"})
    fechaCompra: Date;

    @Column({name: "tiempo_garantia"})
    @IsString()
    @IsNotEmpty({message: "El tiempo de garantía es requerido"})
    @Length(2, 100, {message: "El tiempo de garantía debe tener entre $constraint1 y $constraint2 caracteres"})
    tiempoGarantia: string;

    @Column({name: "garantia"})
    @IsBoolean()
    @IsNotEmpty({message: "La garantía es requerida"})
    garantia: boolean;

    @Column({name: "fecha_entrega"})
    @IsDate()
    @IsNotEmpty({message: "La fecha de entrega es requerida"})
    fechaEntrega: Date;

    @Column({name: "numero_inventario"})
    @IsString()
    @IsNotEmpty({message: "El número de inventario es requerido"})
    @Length(3, 255, {message: "El número de inventario debe tener entre $constraint1 y $constraint2 caracteres"})
    numeroInventario: string;

    @Column({name: "id_usuario", nullable: true})
    @IsInt()
    @IsOptional()
    idUsuario: number;

    @Column({name: "acta_id", nullable: true})
    @IsInt()
    @IsOptional()
    actaId: number;

    @Column({name: "case_protector", nullable: true})
    @IsBoolean()
    @IsOptional()
    caseProtector: boolean;

    @Column({name: "observaciones", nullable: true})
    @IsString()
    @IsOptional()
    observaciones: string;

    @Column({name: "estado"})
    @IsString()
    @IsNotEmpty({message: "El estado es requerido"})
    @Length(2, 100, {message: "El estado debe tener entre $constraint1 y $constraint2 caracteres"})
    estado: string;

    @Column({name: "valor_adquisicion", type: "decimal", precision: 12, scale: 2, nullable: true})
    @IsNumber()
    @IsOptional()
    valorAdquisicion: number;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    // Relaciones
    @ManyToOne(() => LugarRadicacion, sede => sede.celularesRelation)
    @JoinColumn({ name: "sede_id" })
    sedeRelation: LugarRadicacion;

    @ManyToOne(() => Usuarios, usuario => usuario.celularesRelation)
    @JoinColumn({ name: "id_usuario" })
    usuarioRelation: Usuarios;

    @ManyToOne(() => Soportes, soportes => soportes.celularesRelation)
    @JoinColumn({ name: "acta_id" })
    actaRelation: Soportes;

    @OneToMany(() => SeguimientoCelular, seguimiento => seguimiento.celularRelation)
    seguimientoRelation: SeguimientoCelular[];
}