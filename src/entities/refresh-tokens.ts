import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./usuarios";
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
} from "class-validator";

@Entity({ name: "refresh_tokens" })
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "token", type: "text" })
  @IsString()
  @IsNotEmpty({ message: "El token es requerido" })
  token: string;

  @Column({ name: "user_id" })
  @IsInt()
  @IsNotEmpty({ message: "El ID del usuario es requerido" })
  userId: number;

  @Column({ name: "expires_at", type: "timestamp" })
  @IsDate()
  @IsNotEmpty({ message: "La fecha de expiración es requerida" })
  expiresAt: Date;

  @Column({ name: "is_revoked", type: "tinyint", default: 0 })
  @IsBoolean()
  @IsNotEmpty({ message: "El estado de revocación es requerido" })
  isRevoked: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // * Relación con usuarios
  @ManyToOne(() => Usuarios, (usuario) => usuario.refreshTokensRelation)
  @JoinColumn({ name: "user_id" })
  userRelation: Usuarios;
}
