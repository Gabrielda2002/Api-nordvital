import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";
import { IsBoolean, IsInt, IsNotEmpty, IsString, Length, Max, Min } from "class-validator";
import { Carpeta } from "./carpeta";

@Entity("municipio")
export class Municipio extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "IdMunicipio" })
  id: number;

  @Column({ name: "NombreMunicipio" })
  @IsString()
  @IsNotEmpty({message: 'El nombre del municipio no puede estar vacio'})
  @Length(3, 50, {message: 'El nombre del municipio debe tener entre $constraint1 y $constraint2 caracteres'})
  name: string;

  @Column({ name: "NitMunicipio" })
  @IsInt()
  @IsNotEmpty({message: 'El nit del municipio no puede estar vacio'})
  @Min(1, {message: 'El nit del municipio debe tener 1 caracteres'})
  // @Max(9, {message: 'El nit del municipio debe tener 9 caracteres'})
  nitMunicipio: number;

  @Column({ name: "Estado" })
  @IsBoolean()
  @IsNotEmpty({message: 'El estado del municipio no puede estar vacio'})
  status: boolean;

  @UpdateDateColumn({ name: "fecha-actualizacion" })
  updatedAt: Date

  @CreateDateColumn({ name: "fecha-creacion" })
  createdAt: Date

  @OneToMany(() => Carpeta, (carpeta) => carpeta.municipioRelation)
  folderRelation: Carpeta[];

  // * relaciones

  // * relacion con usuarios
  @OneToMany(() => Usuarios, (usuarios) => usuarios.municipioRelation)
  usuarioRelation: Usuarios[];
}
