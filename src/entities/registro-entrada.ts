import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";
import { LugarRadicacion } from "./lugar-radicacion";

@Entity('registro_entrada')
export class RegistroEntrada extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'user_id'})
    userId: number;

    @Column({name: 'sede_id'})
    sedeId: number;

    @Column({name: 'fecha_registro'})
    registerDate: Date;

    @Column({name: 'hora_registro', type: 'time'})
    hourRegister: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updateAt: Date;

    // relaciones
    @ManyToOne(() => Usuarios, user => user.registerEntriesRelation)
    @JoinColumn({name: 'user_id'})
    userRelation: Usuarios;

    @ManyToOne(() => LugarRadicacion, sede => sede.registerEntriesRelation)
    @JoinColumn({name: 'sede_id'})
    sedeRelation: LugarRadicacion;

}