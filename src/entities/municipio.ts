import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";

@Entity("municipio")
export class Municipio extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "IdMunicipio" })
  id: number;

  @Column({ name: "NombreMunicipio" })
  name: string;

  @Column({ name: "NitMunicipio" })
  nitMunicipio: string;

  @Column({ name: "EstadoMunicipio" })
  status: string;

  @UpdateDateColumn({ name: "fecha-actualizacion" })
  updatedAt: Date

  @CreateDateColumn({ name: "fecha-creacion" })
  createdAt: Date

  // * relaciones

  // * relacion con usuarios
  @OneToMany(() => Usuarios, (usuarios) => usuarios.municipioRelation)
  usuarioRelation: Usuarios[];
}
