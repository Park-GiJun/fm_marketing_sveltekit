// UploadedFile 엔티티
// @ts-ignore
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.js';

@Entity('uploaded_files')
export class UploadedFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ name: 'original_name', length: 255 })
  originalName: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'file_size', nullable: true })
  fileSize: number;

  @Column({ name: 'mime_type', nullable: true })
  mimeType: string;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedById: number;

  @Column({ name: 'upload_type', nullable: true })
  uploadType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user: { uploadedFiles: any; }) => user.uploadedFiles)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;
}
