// FAQ 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('faqs')
export class FAQ {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'text' })
  question;

  @Column({ type: 'text' })
  answer;

  @Column({ length: 50 })
  category;

  @Column({ name: 'order_index', default: 0 })
  orderIndex;

  @Column({ name: 'is_active', default: true })
  isActive;

  @Column({ name: 'created_by', nullable: true })
  createdById;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
