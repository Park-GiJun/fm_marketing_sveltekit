// UploadedFile 엔티티
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('uploaded_files')
export class UploadedFile {
  @PrimaryGeneratedColumn()
  id;

  @Column({ length: 255 })
  filename;

  @Column({ name: 'original_name', length: 255 })
  originalName;

  @Column({ name: 'file_path' })
  filePath;

  @Column({ name: 'file_size', nullable: true })
  fileSize;

  @Column({ name: 'mime_type', nullable: true })
  mimeType;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedById;

  @Column({ name: 'upload_type', nullable: true })
  uploadType;

  @Column({ name: 'reference_id', nullable: true })
  referenceId;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;
}
