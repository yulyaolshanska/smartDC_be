import { ApiProperty } from '@nestjs/swagger';
import { NOTE_MIN_LENGTH } from '@shared/consts';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export default class CreateNoteDto {
  @ApiProperty({
    description: 'Doctor first name',
    example: 'John',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  doctorId: number;

  @ApiProperty({
    description: 'Doctor first name',
    example: 'John',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  patientId: number;

  @ApiProperty({
    description: 'Doctor first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Length(NOTE_MIN_LENGTH)
  note: string;

  // @ApiProperty({
  //   description: 'File',
  //   type: 'string',
  //   format: 'binary',
  //   required: false,
  // })
  // file?: Express.Multer.File;
}
