import { ArrayNotEmpty, IsArray } from 'class-validator';

export class UploadFileDto {
  @IsArray()
  @ArrayNotEmpty()
  files: { file: string; fileName: string }[];
}
