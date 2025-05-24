// PointTransaction 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.js';

export enum TransactionType {
  EARN = 'earn',
  SPEND = 'spend',
  WITHDRAW = 'withdraw'
}

@Entity('point_transactions')
export class PointTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'reference_type', nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.pointTransactions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
