import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export default class CreateAppointmentDto {
  @ApiProperty({
    description: 'Appointment start time',
    example: '2022-06-05T09:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Appointment end time',
    example: '2022-06-05T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Zoom link',
    example: '???',
  })
  @IsNotEmpty()
  @IsString()
  zoomLink: string;

  @ApiProperty({
    description: "Local doctor's id",
    example: 1,
  })
  @IsNotEmpty()
  localDoctorId: number;

  @ApiProperty({
    description: "Remote doctor's id",
    example: 2,
  })
  @IsNotEmpty()
  remoteDoctorId: number;

  @ApiProperty({
    description: "Patient's id",
    example: 3,
  })
  @IsNotEmpty()
  patientId: number;
}
