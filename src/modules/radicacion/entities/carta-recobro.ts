import { IsInt, IsOptional, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, IsNull, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Usuarios } from "../../auth/entities/usuarios";

@Entity({ name: "recovery_letters" })
export class CartaRecobro extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "radicacion_id"})
    @IsInt()
    idRadicado: number;

    @Column({name: "user_request_id"})
    @IsInt()
    idUserRequest: number;

    @Column({name: "user_audit_id", nullable: true, type: "int"})
    @IsInt()
    @IsOptional()
    idUserAudit: number | null;

    @Column({name: "observation", nullable: true, type: "text"})
    @IsString()
    @IsOptional()
    observation: string | null;

    @Column({name: "justification", type: "text"})
    @IsString()
    justification: string;

    @Column({name: "print_date", nullable: true, type: "date"})
    @IsString()
    @IsOptional()
    dateImpression: Date | null;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // ? relaciones
    @ManyToOne(() => Radicacion, radicacion => radicacion.cartaRelation)
    @JoinColumn({name: "radicacion_id"})
    radicacionRelation: Radicacion;

    @ManyToOne(() => Usuarios, usuario => usuario.cartaUserRequestRelation)
    @JoinColumn({name: "user_request_id"})
    userRequestRelation: Usuarios;

    @ManyToOne(() => Usuarios, usuario => usuario.cartaUserAuditRelation)
    @JoinColumn({name: "user_audit_id"})
    userAuditRelation: Usuarios;

}