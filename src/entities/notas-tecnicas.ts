import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Convenio } from "./convenio";
import { ServiciosGenerales } from "./servicios-generales";
import { LugarRadicacion } from "./lugar-radicacion";

@Entity("notas_tecnicas")
export class NotasTecnicas extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: 'id_eps'})
    @IsInt()
    @IsNotEmpty()
    idEps: number;

    @Column({name: 'id_servicio'})
    @IsInt()
    @IsNotEmpty()
    idService: number

    @Column({name: 'frecuencia_uso'})
    @IsString()
    frecuencyUse: string;

    @Column({name: 'cantidad'})
    @IsInt()
    @IsNotEmpty()
    amount: number;
    
    @Column({name: 'subgrupo_servicio'})
    @IsString()
    @IsNotEmpty()
    subgroup: string;

    @Column({name: 'grupo_servicio'})
    @IsString()
    @IsNotEmpty()
    group: string;

    @Column({name: 'id_sede'})
    @IsInt()
    @IsNotEmpty()
    idSede: number;

    @Column({name: 'tarifa'})
    @IsInt()
    @IsNotEmpty()
    rate: number;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    // relacion con convenio
    @ManyToOne(() => Convenio, convenio => convenio.notasTecnicasRelation)
    @JoinColumn({name: 'id_eps'})
    convenioRelation: Convenio;

    // relacion con servicios generales
    @ManyToOne(() => ServiciosGenerales, service => service.notasTecnicasRelation)
    @JoinColumn({name: 'id_servicio'})
    serviceRelation: ServiciosGenerales;

    // relacion con lugar radicacion
    @ManyToOne(() => LugarRadicacion, lugarRadicacion => lugarRadicacion.notasTecnicasRelation)
    @JoinColumn({name: 'id_sede'})
    placeRelation: LugarRadicacion;


}