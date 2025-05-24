// Notification 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id;

  @Column({ name: 'user_id' })
  userId;

  @Column({ length: 50 })
  type;

  @Column({ length: 200 })
  title;

  @Column({ type: 'text' })
  message;

  @Column({ name: 'is_read', default: false })
  isRead;

  @Column({ name: 'action_url', nullable: true })
  actionUrl;

  @Column({ type: 'enum', enum: Object.values(NotificationPriority), default: NotificationPriority.MEDIUM })
  priority;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;
}
