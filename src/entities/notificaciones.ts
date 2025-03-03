// src/entities/notification.ts
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "./usuarios";

@Entity("notifications")
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "user_id" })
    userId: number;

    @Column({ name: "title", length: 100 })
    title: string;

    @Column({ name: "message", type: "text" })
    message: string;

    @Column({ name: "reference_id", nullable: true })
    referenceId: number;

    @Column({ name: "reference_type", length: 50, nullable: true })
    referenceType: string;

    @Column({ name: "is_read", default: false })
    isRead: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => Usuarios, (usuario) => usuario.notificationsRelation)
    @JoinColumn({ name: "user_id" })
    userRelation: Usuarios;
}