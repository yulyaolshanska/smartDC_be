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
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  zoomLink: string;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'local_doctor_id' })
  localDoctor: Doctor;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'remote_doctor_id' })
  remoteDoctor: Doctor;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
