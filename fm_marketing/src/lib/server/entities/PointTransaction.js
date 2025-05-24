// PointTransaction 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export const TransactionType = {
  EARN: 'earn',
  SPEND: 'spend',
  WITHDRAW: 'withdraw'
};

@Entity('point_transactions')
export class PointTransaction {
  @PrimaryGeneratedColumn()
  id;

  @Column({ name: 'user_id' })
  userId;

  @Column({ type: 'enum', enum: Object.values(TransactionType) })
  type;

  @Column()
  amount;

  @Column({ nullable: true })
  description;

  @Column({ name: 'reference_type', nullable: true })
  referenceType;

  @Column({ name: 'reference_id', nullable: true })
  referenceId;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;
}
