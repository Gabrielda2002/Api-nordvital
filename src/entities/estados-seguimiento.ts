import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("estadoseguimiento")
export class EstadosSeguimiento extends BaseEntity{

    @PrimaryGeneratedColumn({ name: "id" })
    id: number

    @Column({ name: "NombreEstadoSeguimiento" })
    name: string

    @Column({ name: "Estado" })
    status: string

    // @UpdateDateColumn({ name: "UltimaModificacion" })
    // updatedAt: Date

    // @CreateDateColumn({ name: "FechaRegistro" })
    // createdAt: Date


}