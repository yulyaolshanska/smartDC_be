import { ApiProperty } from '@nestjs/swagger';
import CreateDoctorDto from 'modules/doctor/dto/create-doctor.dto';
import Doctor from 'modules/doctor/entity/doctor.entity';
import Patient from 'modules/patient/entity/patient.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import PatientWithNotes from 'modules/patient/dto/patient-with-notes.dto';

@Entity()
export default class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: '2023-05-10 12:30:00' })
  startTime: Date;

  @Column()
  @ApiProperty({ example: '2023-05-10 13:00:00' })
  endTime: Date;

  @Column()
  @ApiProperty({ example: 'https://zoom.us/meetingid' })
  zoomLink: string;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'localDoctorId' })
  @ApiProperty({ type: CreateDoctorDto })
  localDoctor: Doctor;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'remoteDoctorId' })
  @ApiProperty({ type: CreateDoctorDto })
  remoteDoctor: Doctor;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: 'patientId' })
  @ApiProperty({ type: () => PatientWithNotes })
  patient: Patient;
}
