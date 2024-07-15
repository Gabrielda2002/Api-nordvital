import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("rol")
export class Roles extends BaseEntity {

    @PrimaryGeneratedColumn({name: 'IdRol'})
    id: number;

    @Column({name: 'TipoRol'})
    name: string;


    
}