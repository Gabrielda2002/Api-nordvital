import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";
import { IsBoolean, IsInt, IsNotEmpty, IsString, Length, Max, Min } from "class-validator";
import { Carpeta } from "./carpeta";
import { LugarRadicacion } from "./lugar-radicacion";
import { departamentos } from "./departamentos";

@Entity("municipio")
export class Municipio extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "IdMunicipio" })
  id: number;

  @Column({ name: "NombreMunicipio" })
  @IsString()
  @IsNotEmpty({message: 'El nombre del municipio no puede estar vacio'})
  @Length(3, 50, {message: 'El nombre del municipio debe tener entre $constraint1 y $constraint2 caracteres'})
  name: string;

  @Column({ name: "Estado" })
  @IsBoolean()
  @IsNotEmpty({message: 'El estado del municipio no puede estar vacio'})
  status: boolean;

  @Column({ name: "codigo_municipio" })
  @IsInt()
  @IsNotEmpty({message: 'El codigo del municipio no puede estar vacio'})
  @Min(1, {message: 'El codigo del municipio debe tener 1 caracteres'})
  municipioCode: number;

  @Column({ name: 'id_departamento' })
  @IsInt()
  @IsNotEmpty({message: 'El id del departamento no puede estar vacio'})
  idDepartment: number;

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

  // * relacion con lugar radicacion
  @OneToMany(() => LugarRadicacion, (lugar) => lugar.municipioRelation)
  placeRelation: LugarRadicacion[];

  // ? relacion con departamentos
  @ManyToOne(() => departamentos, (departamento) => departamento.municipioRelation)
  @JoinColumn({ name: 'id_departamento' })
  departmentRelation: departamentos;
}
