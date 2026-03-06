import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsInt, IsNotEmpty, IsString, Length, Max, Min } from "class-validator";
import { Sedes } from "./sedes";
import { departamentos } from "./departamentos";

@Entity("municipalities")
export class Municipio extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "name", type: "varchar", length: 100 })
  @IsString()
  @IsNotEmpty({message: 'El nombre del municipio no puede estar vacio'})
  @Length(3, 50, {message: 'El nombre del municipio debe tener entre $constraint1 y $constraint2 caracteres'})
  name: string;

  @Column({ name: "status", type: "tinyint", width: 1 })
  @IsBoolean()
  @IsNotEmpty({message: 'El estado del municipio no puede estar vacio'})
  status: boolean;

  @Column({ name: "municipality_code", type: "varchar", length: 10, nullable: true })
  @IsInt()
  @IsNotEmpty({message: 'El codigo del municipio no puede estar vacio'})
  @Min(1, {message: 'El codigo del municipio debe tener 1 caracteres'})
  municipalityCode: number;

  @Column({ name: 'department_id', type: 'int' })
  @IsInt()
  @IsNotEmpty({message: 'El id del departamento no puede estar vacio'})
  departmentId: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  // * relaciones

  // * relacion con lugar radicacion
  @OneToMany(() => Sedes, (lugar) => lugar.municipioRelation)
  placeRelation: Sedes[];

  // ? relacion con departamentos
  @ManyToOne(() => departamentos, (departamento) => departamento.municipioRelation)
  @JoinColumn({ name: 'department_id' })
  departmentRelation: departamentos;
}
