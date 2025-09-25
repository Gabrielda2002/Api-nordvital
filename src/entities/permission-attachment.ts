import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PermissionRequest } from "./permission-request";
import { Soportes } from "./soportes";
import { Usuarios } from "./usuarios";
import { IsInt, IsString, Length } from "class-validator";

@Entity({ name: "solicitudes_permisos_adjuntos" })
export class PermissionAttachment extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "solicitud_id", type: "int" })
  @IsInt()
  requestId: number;

  @Column({ name: "soporte_id", type: "int" })
  @IsInt()
  supportId: number;

  @Column({ name: "etiqueta", type: "varchar", length: 50 })
  @IsString()
  @Length(1, 50)
  label: string;

  @Column({ name: "subido_por", type: "int" })
  @IsInt()
  uploadedBy: number;

  @CreateDateColumn({ name: "fecha_creacion" })
  createdAt: Date;

  @ManyToOne(() => PermissionRequest, (r) => r.attachmentsRelation)
  @JoinColumn({ name: "solicitud_id" })
  requestRelation: PermissionRequest;

  @ManyToOne(() => Soportes, (s) => s.permissionsRelation)
  @JoinColumn({ name: "soporte_id" })
  supportRelation: Soportes;

  @ManyToOne(() => Usuarios, (u) => u.id)
  @JoinColumn({ name: "subido_por" })
  uploadedByRelation: Usuarios;
}
