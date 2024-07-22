import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { UnidadFuncional } from "./unidad-funcional";

@Entity("cupspaciente")
export class CupsRadicados extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdCups" })
    id: number

    @Column({ name: "CodigoCupsPacientes" })
    code: number

    @Column({ name: "DescripcionCupsPacientes" })
    DescriptionCode: string

    @Column({name: "EstadoCupsRadicacion"})
    status: string

    @Column({name: "observacionCups"})
    observation: string

    @Column({name: "UnidadFuncional"})
    functionalUnit: number

    @Column({name: "IDRADICADO"})
    idRadicacion: number
    
    @UpdateDateColumn({ name: "UltimaModificacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "FechaRegistro" })
    createdAt: Date

    //* relaciones

    @ManyToOne(() => Radicacion, (radicacion) => radicacion.cupsRadicadosRelation)
    @JoinColumn({ name: "IDRADICADO" })
    radicacionRelation: Radicacion

    @ManyToOne(() => UnidadFuncional, (unidadFuncional) => unidadFuncional.cupsRadicadosRelation)
    @JoinColumn({ name: "UnidadFuncional" })
    functionalUnitRelation: UnidadFuncional

}