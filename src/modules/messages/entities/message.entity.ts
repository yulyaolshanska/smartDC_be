import Doctor from 'modules/doctor/entity/doctor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: false,
    default: null,
  })
  text: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.messages)
  @JoinTable()
  user: Doctor;

  @CreateDateColumn()
  createdAt: Date;
}
