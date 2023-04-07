import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '@shared/consts';

export default class LoginDoctorDto {
  @ApiProperty({
    description: "Doctor's email",
    example: 'john_doe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Doctor's password",
    example: '11111111Qq',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password should contain 10 characters, at least one uppercase and one lowercase letter',
  })
  password: string;
}
