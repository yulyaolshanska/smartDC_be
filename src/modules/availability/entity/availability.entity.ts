import { ApiProperty } from '@nestjs/swagger';
import CreateDoctorDto from 'modules/doctor/dto/create-doctor.dto';
import Doctor from 'modules/doctor/entity/doctor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Availability {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'c3864420-2d55-4483-b861-4970e3b7ea40' })
  uuid: string;

  @Column()
  @ApiProperty({ example: 'Working hours' })
  title: string;

  @Column()
  @ApiProperty({ example: '2023-05-10 03:21:00' })
  start: Date;

  @Column()
  @ApiProperty({ example: '2023-05-10 05:21:00' })
  end: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.availability)
  @ApiProperty({ type: CreateDoctorDto })
  doctor: Doctor;
}
