import { ApiProperty } from '@nestjs/swagger';
import { NOTE_MIN_LENGTH } from '@shared/consts';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export default class CreateNoteDto {
  @ApiProperty({
    description: 'Doctor Id',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  doctor: number;

  @ApiProperty({
    description: 'Patient Id',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  patient: number;

  @ApiProperty({
    description: 'Text of the note',
    example: 'Patient has pain',
  })
  @IsString()
  @IsNotEmpty()
  @Length(NOTE_MIN_LENGTH)
  note: string;
}
