import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  localDoctorId: number;

  @Column()
  remoteDoctorId: number;

  @Column()
  patientId: number;
}
