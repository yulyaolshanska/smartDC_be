import { ApiProperty } from '@nestjs/swagger';
import Doctor from 'modules/doctor/entity/doctor.entity';
import Patient from 'modules/patient/entity/patient.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import File from './file.entity';

@Entity()
export default class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '231' })
  @ManyToOne(() => Doctor, (doctor) => doctor.id)
  doctor: number;

  @ApiProperty({ example: '765' })
  @ManyToOne(() => Patient, (patient) => patient.id)
  patient: number;

  @ApiProperty({ example: 'Patient have big dick back pain disorder' })
  @Column({
    default: null,
    unique: false,
  })
  note: string;

  @ApiProperty({ example: '???' })
  @OneToOne(() => File, (file) => file.id, { nullable: true })
  @JoinColumn()
  file?: File | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
