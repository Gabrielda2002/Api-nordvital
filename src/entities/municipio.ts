import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  // @UpdateDateColumn({ name: "UltimaModificacion" })
  // updatedAt: Date

  // @CreateDateColumn({ name: "FechaRegistro" })
  // createdAt: Date

  // * relaciones

  // * relacion con usuarios
  @OneToMany(() => Usuarios, (usuarios) => usuarios.municipioRelation)
  usuarioRelation: Usuarios[];
}
