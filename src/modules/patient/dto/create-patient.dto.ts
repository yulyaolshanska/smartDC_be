import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@shared/enums';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  IsEnum,
  IsISO31661Alpha2,
} from 'class-validator';
import {
  NAME_MIN_LENGTH,
  CITY_REGEX,
  ADDRESS_REGEX,
  DATE_REGEX,
  TIME_ZONE_REGEX,
} from 'shared/consts';

export default class CreatePatientDto {
  @ApiProperty({
    description: 'Patient first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH)
  firstName: string;

  @ApiProperty({
    description: 'Patient last name',
    example: 'Nedoe',
  })
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH)
  lastName: string;

  @ApiProperty({
    description: "Patient's phone ",
    example: '+380992598283',
  })
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: "Patient's email",
    example: 'john_nedoe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Patient's gender",
    example: 'Male',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: "Patient's birthday",
    example: '2000-10-10',
  })
  @Matches(DATE_REGEX, {
    message: 'Invalid date type',
  })
  birthDate: string;

  @ApiProperty({
    description: "Patient's country",
    example: 'DE',
  })
  @IsISO31661Alpha2()
  @IsString()
  country: string;

  @ApiProperty({
    description: "Patient's city",
    example: 'Berlin',
  })
  @Matches(CITY_REGEX, {
    message: 'Invalid city name',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: "Patient's address",
    example: 'Berger Str. 22',
  })
  @Matches(ADDRESS_REGEX, {
    message: 'Invalid address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: "Patient's time zone",
    example: '(GMT+2) Europe/Berlin',
  })
  @Matches(TIME_ZONE_REGEX, {
    message: 'Invalid time zone format',
  })
  @IsString()
  timeZone: string;

  @ApiProperty({
    description: "Patient's overview",
    example: 'Some issue',
  })
  @IsString()
  overview: string;
}
