import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  })
  @Column()
  phone: string;

  @ApiProperty({ example: 'john_doe@gmail.com' })
  @Column({
    unique: true,
    default: null,
  })
  @Column()
  email: string;

  @ApiProperty({ example: '11111111Qq' })
  @Column({
    default: null,
  })
  @Column()
  password: string;

  @ApiProperty({ example: '????' })
  @Column({
    default: null,
  })
  @Column()
  activationLink: string;

  @ApiProperty({ example: '0' })
  @Column({
    default: false,
  })
  @Column()
  isVerified: boolean;

  @ApiProperty({ example: 'Local' })
  @Column({
    default: null,
  })
  @Column()
  role: string;

  @ApiProperty({ example: 'some adress' })
  @Column({
    default: null,
  })
  @Column()
  address: string;

  @ApiProperty({ example: '20/01/2000' })
  @Column({
    default: null,
  })
  @Column()
  birthDate: string;

  @ApiProperty({ example: 'Kiev' })
  @Column({
    default: null,
  })
  @Column()
  city: string;

  @ApiProperty({ example: ' DE' })
  @Column({
    default: null,
  })
  @Column()
  country: string;

  @ApiProperty({ example: ' 1' })
  @Column({
    default: null,
  })
  @Column()
  specialityId: number;

  @ApiProperty({ example: ' ????' })
  @Column({
    default: null,
  })
  @Column()
  photoUrl: string;

  @ApiProperty({ example: ' ????' })
  @Column({
    default: null,
  })
  @Column()
  timeZone: string;

  @ApiProperty({ example: ' Male' })
  @Column({
    default: null,
  })
  @Column()
  gender: string;
}
