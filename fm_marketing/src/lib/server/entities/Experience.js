// Experience 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export const ExperienceType = {
  EXPERIENCE: '체험단',
  REPORTER: '기자단'
};

export const ExperienceStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
  COMPLETED: 'completed'
};

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn()
  id;

  @Column({ length: 200 })
  title;

  @Column({ type: 'text' })
  content;

  @Column({ length: 50 })
  category;

  @Column({ type: 'enum', enum: Object.values(ExperienceType) })
  type;

  @Column({ length: 50 })
  region;

  @Column({ nullable: true })
  location;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate;

  @Column({ name: 'application_deadline', type: 'date', nullable: true })
  applicationDeadline;

  @Column({ name: 'max_participants', nullable: true })
  maxParticipants;

  @Column({ name: 'current_participants', default: 0 })
  currentParticipants;

  @Column({ name: 'required_points', default: 0 })
  requiredPoints;

  @Column({ name: 'reward_points', default: 0 })
  rewardPoints;

  @Column({ name: 'reward_description', type: 'text', nullable: true })
  rewardDescription;

  @Column({ type: 'text', nullable: true })
  requirements;

  @Column({ name: 'company_name', nullable: true, length: 255 })
  companyName;

  @Column({ name: 'contact_info', nullable: true, length: 500 })
  contactInfo;

  @Column({ type: 'text', nullable: true })
  images; // JSON.stringify된 배열

  @Column({ type: 'text', nullable: true })
  tags; // JSON.stringify된 배열

  @Column({ type: 'enum', enum: Object.values(ExperienceStatus), default: ExperienceStatus.ACTIVE })
  status;

  @Column({ name: 'is_promoted', default: false })
  isPromoted;

  @Column({ default: 0 })
  views;

  @Column({ default: 0 })
  likes;

  @Column({ name: 'created_by' })
  createdById;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
