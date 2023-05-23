import { ApiProperty } from '@nestjs/swagger';
import Note from 'modules/notes/entity/note.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import CreateNoteDto from 'modules/notes/dto/create-note.dto';
import { Gender } from '@shared/enums';

@Entity()
export default class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Note, (note) => note.patient)
  @ApiProperty({ type: CreateNoteDto })
  notes: Note[];

  @ApiProperty({ example: 'John' })
  @Column({
    unique: false,
    default: null,
  })
  firstName: string;

  @ApiProperty({ example: 'Nedoe' })
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
  phoneNumber: string;

  @ApiProperty({ example: 'john_nedoe@gmail.com' })
  @Column({
    unique: true,
    default: null,
  })
  email: string;

  @ApiProperty({ example: 'Berger Str. 22' })
  @Column({
    default: null,
  })
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '2000-10-10' })
  @Column({
    default: null,
  })
  @IsOptional()
  birthDate?: string;

  @ApiProperty({ example: 'Berlin' })
  @Column({
    default: null,
  })
  @IsOptional()
  city?: string;

  @ApiProperty({ example: ' DE' })
  @Column({
    default: null,
  })
  @IsOptional()
  country?: string;

  @ApiProperty({ example: '(GMT+2) Europe/Berlin' })
  @Column({
    default: null,
  })
  @IsOptional()
  timeZone?: string;

  @ApiProperty({ example: ' Male' })
  @Column({
    default: null,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    description: "Patient's overview",
    example: 'Some issue',
  })
  @Column({
    default: null,
  })
  @IsString()
  @IsOptional()
  overview?: string;
}
