// ExperienceApplication 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';

export const ApplicationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

@Entity('experience_applications')
@Unique(['experienceId', 'userId'])
export class ExperienceApplication {
  @PrimaryGeneratedColumn()
  id;

  @Column({ name: 'experience_id' })
  experienceId;

  @Column({ name: 'user_id' })
  userId;

  @Column({ name: 'application_text', type: 'text', nullable: true })
  applicationText;

  @Column({ type: 'enum', enum: Object.values(ApplicationStatus), default: ApplicationStatus.PENDING })
  status;

  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote;

  @Column({ name: 'applied_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  appliedAt;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt;
}
