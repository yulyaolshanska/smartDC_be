import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@shared/enums';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  IsEnum,
  IsISO31661Alpha2,
  IsNumber,
} from 'class-validator';
import {
  NAME_MIN_LENGTH,
  PASSWORD_REGEX,
  CITY_REGEX,
  ADDRESS_REGEX,
  DATE_REGEX,
  TIME_ZONE_REGEX,
} from 'shared/consts';

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
  phoneNumber: string;

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

  @ApiProperty({
    description: "Doctor's specialization",
    example: 'Germany',
  })
  @IsNumber()
  specialityId: number;

  @ApiProperty({
    description: "Doctor's gender",
    example: 'Male',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: "Doctor's birthday",
    example: '10-20-1980',
  })
  @Matches(DATE_REGEX, {
    message: 'Invalid date type',
  })
  birthDate: string;

  @ApiProperty({
    description: "Doctor's country",
    example: 'DE',
  })
  @IsISO31661Alpha2()
  @IsString()
  country: string;

  @ApiProperty({
    description: "Doctor's city",
    example: 'Frankfurt',
  })
  @Matches(CITY_REGEX, {
    message: 'Invalid city name',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: "Doctor's address",
    example: 'Berger Str. 22',
  })
  @Matches(ADDRESS_REGEX, {
    message: 'Invalid address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: "Doctor's time zone",
    example: '(GMT+2) Europe/Berlin',
  })
  @Matches(TIME_ZONE_REGEX, {
    message: 'Invalid time zone format',
  })
  @IsString()
  timeZone: string;

  @ApiProperty({
    description: "Doctor's role",
    example: 'Local',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role: string;
}
