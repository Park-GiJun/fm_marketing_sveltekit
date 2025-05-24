// Experience 엔티티
// @ts-ignore
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User.js';
import { ExperienceApplication } from './ExperienceApplication.js';

export enum ExperienceType {
  EXPERIENCE = '체험단',
  REPORTER = '기자단'
}

export enum ExperienceStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  COMPLETED = 'completed'
}

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'enum', enum: ExperienceType })
  type: ExperienceType;

  @Column({ length: 50 })
  region: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'application_deadline', type: 'date', nullable: true })
  applicationDeadline: Date;

  @Column({ name: 'max_participants', nullable: true })
  maxParticipants: number;

  @Column({ name: 'current_participants', default: 0 })
  currentParticipants: number;

  @Column({ name: 'required_points', default: 0 })
  requiredPoints: number;

  @Column({ name: 'reward_points', default: 0 })
  rewardPoints: number;

  @Column({ name: 'reward_description', type: 'text', nullable: true })
  rewardDescription: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ name: 'contact_info', nullable: true })
  contactInfo: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'enum', enum: ExperienceStatus, default: ExperienceStatus.ACTIVE })
  status: ExperienceStatus;

  @Column({ name: 'is_promoted', default: false })
  isPromoted: boolean;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ name: 'created_by' })
  createdById: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user: { createdExperiences: any; }) => user.createdExperiences)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => ExperienceApplication, (application: { experience: any; }) => application.experience)
  applications: ExperienceApplication[];
}
