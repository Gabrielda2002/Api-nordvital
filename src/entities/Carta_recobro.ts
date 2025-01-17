import { IsInt, IsOptional, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, IsNull, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Usuarios } from "./usuarios";

@Entity({ name: "carta_recobro" })
export class CartaRecobro extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "id_radicado"})
    @IsInt()
    idRadicado: number;

    @Column({name: "id_usuario_solicita"})
    @IsInt()
    idUserRequest: number;

    @Column({name: "id_usuario_audita", nullable: true, type: "int"})
    @IsInt()
    @IsOptional()
    idUserAudit: number | null;

    @Column({name: "observacion", nullable: true, type: "text"})
    @IsString()
    @IsOptional()
    observation: string | null;

    @Column({name: "justificacion"})
    @IsString()
    justification: string;

    @Column({name: "fecha_impresion", nullable: true, type: "date"})
    @IsString()
    @IsOptional()
    dateImpression: Date | null;

    @CreateDateColumn({name: "created_at"})
    creatAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updateAt: Date;

    // ? relaciones
    @ManyToOne(() => Radicacion, radicacion => radicacion.cartaRelation)
    @JoinColumn({name: "id_radicado"})
    radicacionRelation: Radicacion;

    @ManyToOne(() => Usuarios, usuario => usuario.cartaUserRequestRelation)
    @JoinColumn({name: "id_usuario_solicita"})
    userRequestRelation: Usuarios;

    @ManyToOne(() => Usuarios, usuario => usuario.cartaUserAuditRelation)
    @JoinColumn({name: "id_usuario_audita"})
    userAuditRelation: Usuarios;

}