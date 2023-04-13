import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  IsEnum,
  IsISO31661Alpha2,
  IsNumber,
} from 'class-validator';
import {
  CITY_REGEX,
  ADDRESS_REGEX,
  DATE_REGEX,
  TIME_ZONE_REGEX,
} from '../../../shared/consts';
import { Role, Gender } from '../../../shared/enums';

export default class UpdateGoogleDoctorDto {
  @ApiProperty({
    description: "Doctor's phone ",
    example: '+380992598283',
  })
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: "Doctor's specialization",
    example: 0,
  })
  @IsNumber()
  specialization: number;

  @ApiProperty({
    description: "Doctor's gender",
    example: 'Male',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: "Doctor's birthday",
    example: '10/20/1980',
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
