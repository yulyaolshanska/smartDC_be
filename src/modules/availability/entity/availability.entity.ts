import Doctor from 'modules/doctor/entity/doctor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  title: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.availability)
  doctor: Doctor;
}
