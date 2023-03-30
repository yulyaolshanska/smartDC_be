import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/shared/enums';

export default class CreateDoctorDto {
  @ApiProperty({
    description: 'Doctor first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Doctor last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: "Doctor's email",
    example: 'john_doe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Doctor's password",
    example: 'R5bd7BBe',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "Doctor's role",
    example: 'Local',
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
