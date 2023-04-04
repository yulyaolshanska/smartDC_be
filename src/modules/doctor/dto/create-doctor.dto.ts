import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { NAME_MIN_LENGTH, PASSWORD_REGEX } from '../../../shared/consts';

export default class CreateDoctorDto {
  @ApiProperty({
    description: 'Doctor first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH)
  firstName: string;

  @ApiProperty({
    description: 'Doctor last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH)
  lastName: string;

  @ApiProperty({
    description: "Doctor's phone ",
    example: '+380992598283',
  })
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  @IsNotEmpty()
  phone: string;

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
  @Matches(PASSWORD_REGEX, {
    message:
      'Password should contain 10 characters, at least one uppercase and one lowercase letter',
  })
  password: string;
}
