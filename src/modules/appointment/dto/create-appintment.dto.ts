import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export default class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsNotEmpty()
  @IsString()
  zoomLink: string;

  @IsNotEmpty()
  localDoctorId: number;

  @IsNotEmpty()
  remoteDoctorId: number;

  @IsNotEmpty()
  patientId: number;
}
