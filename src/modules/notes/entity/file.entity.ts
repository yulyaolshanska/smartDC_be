import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import Note from './note.entity';

@Entity('file')
export default class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @OneToOne(() => Note, (note) => note.id, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  note?: Note;
}
