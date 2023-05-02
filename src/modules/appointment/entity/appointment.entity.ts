import Doctor from 'modules/doctor/entity/doctor.entity';
import Patient from 'modules/patient/entity/patient.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  zoomLink: string;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'localDoctorId' })
  localDoctor: Doctor;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'remoteDoctorId' })
  remoteDoctor: Doctor;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;
}
