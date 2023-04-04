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
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @Column({
    unique: false,
    default: null,
  })
  last_name: string;

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

  @ApiProperty({ example: 'R5bd7BBe' })
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
  activation_link: string;

  @ApiProperty({ example: '????' })
  @Column({
    default: false,
  })
  @Column()
  is_verified: boolean;

  @ApiProperty({ example: 'Local' })
  @Column({
    default: null,
  })
  @Column()
  role: string;
}
