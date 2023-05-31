import { IsArray, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsArray()
  @IsString({ each: true })
  file: string[];

  @IsArray()
  @IsString({ each: true })
  fileName: string[];
}
