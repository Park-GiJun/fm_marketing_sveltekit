// Guide 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('guides')
export class Guide {
  @PrimaryGeneratedColumn()
  id;

  @Column({ length: 200 })
  title;

  @Column({ type: 'text' })
  content;

  @Column({ length: 50 })
  category;

  @Column({ nullable: true })
  thumbnail;

  @Column({ default: 0 })
  views;

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
