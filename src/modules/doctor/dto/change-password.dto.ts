import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '@shared/consts';

export default class ResetPasswordDto {
  @ApiProperty({
    description: 'JwtToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhem5vLm9sZWdAZ21haWwuY29tIiwiaWQiOjEyLCJpYXQiOjE2ODEzMzIyMjUsImV4cCI6MTY4MTQxODYyNX0.hh1q3sVcTg_Xwz73uE8gIV6SeuKfQeUtyfzB-SuwsVg',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

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
