// CommunityPost 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn()
  id;

  @Column({ length: 200 })
  title;

  @Column({ type: 'text' })
  content;

  @Column({ length: 50 })
  category;

  @Column({ name: 'author_id' })
  authorId;

  @Column({ type: 'text', nullable: true })
  images; // JSON.stringify된 배열

  @Column({ type: 'text', nullable: true })
  tags; // JSON.stringify된 배열

  @Column({ default: 0 })
  views;

  @Column({ default: 0 })
  likes;

  @Column({ name: 'is_pinned', default: false })
  isPinned;

  @Column({ name: 'is_deleted', default: false })
  isDeleted;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
