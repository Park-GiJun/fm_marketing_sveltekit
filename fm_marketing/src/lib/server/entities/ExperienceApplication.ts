// ExperienceApplication 엔티티
// @ts-ignore
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './User.js';
import { Experience } from './Experience.js';

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

@Entity('experience_applications')
@Unique(['experienceId', 'userId'])
export class ExperienceApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'experience_id' })
  experienceId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'application_text', type: 'text', nullable: true })
  applicationText: string;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote: string;

  @Column({ name: 'applied_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  appliedAt: Date;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  // Relations
  @ManyToOne(() => Experience, (experience: { applications: any; }) => experience.applications)
  @JoinColumn({ name: 'experience_id' })
  experience: Experience;

  @ManyToOne(() => User, (user: { applications: any; }) => user.applications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
