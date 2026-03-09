import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { UnidadFuncional } from "./unidad-funcional";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { Estados } from "./estados";
import { SeguimientoAuxiliar } from "./seguimiento-auxiliar";
import { ServiciosSolicitados } from "./servicios-solicitados";

@Entity("cups_radicados")
export class CupsRadicados extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number

    @Column({name: "status_id"})
    @IsNumber()
    @IsNotEmpty({message: "El estado es requerido"})
    statusId: number

    @Column({name: "observation"})
    @IsNotEmpty({message: "La observación del cups es requerida"})
    @IsString()
    @Length(1, 500, {message: "La observación debe tener entre 1 y 500 caracteres"})
    observation: string

    @Column({name: "functional_unit_id"})
    @IsInt()
    @IsNotEmpty({message: "La unidad funcional es requerida"})
    functionalUnitId: number

    @Column({name: "radicacion_id"})
    @IsInt()
    @Min(1)
    @Max(999999)
    @IsNotEmpty({message: "El ID de radicación es requerido"})
    radicacionId: number

    @Column({name: "status_recovery_latter", nullable: true, type: "varchar", length: 50})
    @IsString()
    @IsOptional()
    statusRecoveryLatter: string | null;
    
    @Column({name: "date_audit_recovery_latter", nullable: true, type: "date"})
    @IsOptional()
    dateAuditRecoveryLatter: Date | null;

    @Column({name: "quantity"})
    @IsInt()
    @IsNotEmpty({message: "La cantidad es requerida"})
    quantity: number;

    @Column({name: "requested_service_id", nullable: true})
    @IsOptional()
    @IsInt()
    requestedServiceId: number | null;

    @UpdateDateColumn({ name: "UltimaModificacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "FechaRegistro" })
    createdAt: Date

    //* relaciones

    @ManyToOne(() => Radicacion, (radicacion) => radicacion.cupsRadicadosRelation)
    @JoinColumn({ name: "radicacion_id" })
    radicacionRelation: Radicacion

    // * relacion con autorizacion
    @ManyToOne(() => Estados, (estados) => estados.cupsRelation)
    @JoinColumn({ name: "status_id" })
    statusRelation: Estados;

    @ManyToOne(() => UnidadFuncional, (unidadFuncional) => unidadFuncional.cupsRadicadosRelation)
    @JoinColumn({ name: "functional_unit_id" })
    functionalUnitRelation: UnidadFuncional

    @OneToMany(() => SeguimientoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.cupsRadicadosRelation)
    seguimientoAuxiliarRelation: SeguimientoAuxiliar[]

    // * relación con servicios solicitados
    @ManyToOne(() => ServiciosSolicitados, (servicio) => servicio.cupsRadicadosRelation)
    @JoinColumn({ name: "requested_service_id" })
    servicioRelation: ServiciosSolicitados

}

