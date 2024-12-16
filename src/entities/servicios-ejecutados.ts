import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LugarRadicacion } from "./lugar-radicacion";
import { ServiciosGenerales } from "./servicios-generales";
import { TipoDocumento } from "./tipo-documento";

@Entity("servicios_ejecutados")
export class ServiciosEjecutados extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: 'id_sede'})
    @IsInt()
    @IsNotEmpty()
    idSede: number;

    @Column({name: 'id_servicio'})
    @IsInt()
    @IsNotEmpty()
    idService: number

    @Column({name: 'cantidad'})
    @IsInt()
    @IsNotEmpty()
    amount: number;

    @Column({name: 'tarifa'})
    @IsInt()
    @IsNotEmpty()
    rate: number;

    @Column({name: 'estado_servicio'})
    @IsString()
    @IsNotEmpty()
    statusService: string;

    @Column({name: 'grupo_servicio'})
    group: string;

    @Column({name: 'subgrupo_servicio'})
    @IsString()
    @IsNotEmpty()
    subGroup: string;

    @Column({name: 'tipo_documento'})
    @IsInt()
    @IsNotEmpty()
    documentType: number;

    @Column({name: 'identificacion'}) 
    @IsInt()
    @IsNotEmpty()
    identification: number;

    @Column({name: 'nombre_paciente'})
    @IsString()
    @IsNotEmpty()
    patientName: string;

    @Column({name: 'sexo_pac'})
    @IsString()
    @IsNotEmpty()
    patientSex: string;

    @Column({name: 'fecha_nacimiento'})
    @IsNotEmpty()
    dateBirth: Date;

    @Column({name: 'grupo_rias'})
    @IsString()
    @IsNotEmpty()
    riasGroup: string;

    @Column({name: 'dx_principal'})
    @IsString()
    @IsNotEmpty()
    mainDx: string;

    @Column({name: 'cod_medico_remisor'})
    @IsString()
    @IsNotEmpty()
    medicoCode: string;

    @Column({name: 'nombre_medico_remisor'})
    @IsString()
    @IsNotEmpty()
    medicoName: string;

    @Column({name: 'spc_medico_remisor'})
    @IsString()
    @IsNotEmpty()
    medicoSpc: string;

    @Column({name: 'sede_atenc'})
    @IsString()
    @IsNotEmpty()
    attentionHeadquarters: string;

    @Column({name: 'nombre_contrato'})
    @IsString()
    @IsNotEmpty()
    nameContract: string;

    @Column({name: 'regimen_usuario'})
    @IsString()
    @IsNotEmpty()
    userRegimen: string;

    @Column({name: 'num_autorizacion'})
    @IsString()
    @IsNotEmpty()
    authorizationNumber: string;

    @Column({name: 'fecha_asign'})
    assignmentDate: Date;

    @Column({name: 'fecha_orden'})
    @IsNotEmpty()
    orderDate: Date;

    @Column({name: 'fecha_prest'})
    @IsNotEmpty()
    prestDate: Date;

    @Column({name: 'estado_cita'})
    @IsString()
    @IsNotEmpty()
    appointmentStatus: string;

    @Column({name: 'tipo_servicio'})
    serviceType: string;

    @Column({name: 'tipo_cita'})
    @IsString()
    @IsNotEmpty()
    appointmentType: string;

    @Column({name: 'usuario_genera'})
    @IsString()
    @IsNotEmpty()
    userGenerated: string;

    @Column({name: 'convenio'})
    @IsString()
    @IsNotEmpty()
    convenio: string;

    @Column({name: 'servicio_pgp'})
    @IsString()
    @IsNotEmpty()
    servicePgp: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    // relacion con lugar radicacion
    @ManyToOne(() => LugarRadicacion, lugar => lugar.serviciosEjecutadosRelation)
    @JoinColumn({name: 'id_sede'})
    placeRelation: LugarRadicacion;

    // relacion con servicios generales
    @ManyToOne(() => ServiciosGenerales, service => service.serviciosEjecutadosRelation)
    @JoinColumn({name: 'id_servicio'})
    servicioRelation: ServiciosGenerales;

    // relacion con documento
    @ManyToOne(() => TipoDocumento, document => document.serviciosEjecutadosRelation)
    @JoinColumn({name: 'tipo_documento'})
    documentTypeRelation: TipoDocumento;
    
}