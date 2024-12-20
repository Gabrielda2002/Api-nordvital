import { IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NotasTecnicas } from "./notas-tecnicas";
import { ServiciosEjecutados } from "./servicios-ejecutados";

@Entity("servicios")
export class ServiciosGenerales extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: 'codigo_servicio'})
    @IsNotEmpty()
    code: string;

    @Column({name: 'descripcion'})
    @IsString()
    @IsNotEmpty()
    description: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updateAt: Date;
    
    // relacion con notas tecnicas
    @OneToMany(() => NotasTecnicas, notasTecnicas => notasTecnicas.serviceRelation)
    notasTecnicasRelation: NotasTecnicas[];

    // relacion con servicios ejecutados
    @OneToMany(() => ServiciosEjecutados, servicio => servicio.servicioRelation)
    serviciosEjecutadosRelation: ServiciosEjecutados[];

}