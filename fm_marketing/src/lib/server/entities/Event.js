// Event 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export const EventType = {
  EVENT: 'event',
  NOTICE: 'notice'
};

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id;

  @Column({ length: 200 })
  title;

  @Column({ type: 'text' })
  content;

  @Column({ type: 'enum', enum: Object.values(EventType) })
  type;

  @Column({ length: 50, nullable: true })
  category;

  @Column({ name: 'image_url', nullable: true })
  imageUrl;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate;

  @Column({ name: 'is_active', default: true })
  isActive;

  @Column({ name: 'is_important', default: false })
  isImportant;

  @Column({ default: 0 })
  views;

  @Column({ name: 'created_by', nullable: true })
  createdById;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
