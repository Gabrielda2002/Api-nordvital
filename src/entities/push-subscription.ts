import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from "./usuarios";

@Entity('push_subscriptions')
export class PushSubscription extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @Column({ name: 'subscription',type: 'text' })
    subscription: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp'})
    updatedAt: Date;

    @ManyToOne(() => Usuarios, (usuario) => usuario.pushSubscriptionRelation)
    @JoinColumn({ name: 'user_id' })
    userRelation: Usuarios;

}