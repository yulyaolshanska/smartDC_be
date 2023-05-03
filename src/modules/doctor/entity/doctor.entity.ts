import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Availability from '../../availability/entity/availability.entity';

@Entity()
export default class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John' })
  @Column({
    unique: false,
    default: null,
  })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column({
    unique: false,
    default: null,
  })
  lastName: string;

  @ApiProperty({ example: '+390992598283' })
  @Column({
    unique: true,
    default: null,
    nullable: true,
  })
  phoneNumber: string;

  @ApiProperty({ example: 'john_doe@gmail.com' })
  @Column({
    unique: true,
    default: null,
  })
  email: string;

  @ApiProperty({ example: 'Derikloshad' })
  @Column({
    nullable: true,
  })
  password: string;

  @ApiProperty({ example: '????' })
  @Column({
    default: null,
    nullable: true,
  })
  activationLink: string;

  @ApiProperty({ example: false })
  @Column({
    default: false,
    nullable: true,
  })
  isVerified: boolean;

  @ApiProperty({ example: 'Local' })
  @Column({
    default: null,
    nullable: true,
  })
  role: string;

  @ApiProperty({ example: 'some adress' })
  @Column({ default: null, nullable: true })
  address: string;

  @ApiProperty({ example: '20-01-2000' })
  @Column({
    nullable: true,
    default: null,
  })
  birthDate: string;

  @ApiProperty({ example: 'Kiev' })
  @Column({
    nullable: true,
    default: null,
  })
  city: string;

  @ApiProperty({ example: ' DE' })
  @Column({
    nullable: true,
    default: null,
  })
  country: string;

  @ApiProperty({ example: ' 1' })
  @Column({
    nullable: true,
    default: null,
  })
  specialization: number;

  @ApiProperty({ example: ' ????' })
  @Column({
    nullable: true,
    default: null,
  })
  photoUrl: string;

  @ApiProperty({ example: ' ????' })
  @Column({
    nullable: true,
    default: null,
  })
  timeZone: string;

  @ApiProperty({ example: ' Male' })
  @Column({
    nullable: true,
    default: null,
  })
  gender: string;

  @ManyToOne(() => Availability, (availability) => availability.doctor)
  availability: Availability[];
}
