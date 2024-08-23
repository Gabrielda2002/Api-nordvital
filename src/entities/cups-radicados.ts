import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { UnidadFuncional } from "./unidad-funcional";
import { IsInt, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from "class-validator";
import { Estados } from "./estados";

@Entity("cupspaciente")
export class CupsRadicados extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdCups" })
    id: number

    @Column({ name: "CodigoCupsPacientes" })
    @IsNotEmpty({message: "El código del cups es requerido"})
    @IsInt()
    @Min(1)
    code: number

    @Column({ name: "DescripcionCupsPacientes" })
    @IsNotEmpty({message: "La descripción del cups es requerida"})
    DescriptionCode: string

    @Column({name: "Estado"})
    @IsNumber()
    status: number

    @Column({name: "observacionCups"})
    @IsNotEmpty({message: "La observación del cups es requerida"})
    @IsString()
    @Length(1, 150, {message: "La observación debe tener entre 1 y 150 caracteres"})
    observation: string

    @Column({name: "UnidadFuncional"})
    @IsInt()
    functionalUnit: number

    @Column({name: "IDRADICADO"})
    @IsInt()
    @Min(1)
    @Max(999999)
    idRadicacion: number
    
    @UpdateDateColumn({ name: "UltimaModificacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "FechaRegistro" })
    createdAt: Date

    //* relaciones

    @ManyToOne(() => Radicacion, (radicacion) => radicacion.cupsRadicadosRelation)
    @JoinColumn({ name: "IDRADICADO" })
    radicacionRelation: Radicacion

    // * relacion con autorizacion
    @ManyToOne(() => Estados, (estados) => estados.cupsRelation)
    @JoinColumn({ name: "Estado" })
    statusRelation: Estados;

    @ManyToOne(() => UnidadFuncional, (unidadFuncional) => unidadFuncional.cupsRadicadosRelation)
    @JoinColumn({ name: "UnidadFuncional" })
    functionalUnitRelation: UnidadFuncional

}

