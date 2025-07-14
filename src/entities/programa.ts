import { IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DemandaInducida } from "./demanda-inducida";
import { ProgramaMetaHistorico } from "./programa-meta-historico";
@Entity({ name: "programa" })
export class Programa extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "nombre", type: "varchar", nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;    

    @OneToMany(() => DemandaInducida, (demandaInducida) => demandaInducida.programaRelation)
    demandaInducidaRelation: DemandaInducida[];

    @OneToMany(() => ProgramaMetaHistorico, (metaHistorico) => metaHistorico.programaRelation)
    metaHistoricoRelation: ProgramaMetaHistorico[];
}