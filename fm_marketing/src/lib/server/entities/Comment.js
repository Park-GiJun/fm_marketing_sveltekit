// Comment 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id;

  @Column({ name: 'post_id' })
  postId;

  @Column({ name: 'parent_id', nullable: true })
  parentId;

  @Column({ name: 'author_id' })
  authorId;

  @Column({ type: 'text' })
  content;

  @Column({ name: 'is_deleted', default: false })
  isDeleted;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
