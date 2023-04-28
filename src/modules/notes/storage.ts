import { diskStorage } from 'multer';
import { Request } from 'express';

const MAX_HEX_VALUE = 16;
const KEY_LENGTH = 18;

const generateId = (): string =>
  Array(KEY_LENGTH)
    .fill(null)
    .map(() =>
      Math.round(Math.random() * MAX_HEX_VALUE).toString(MAX_HEX_VALUE),
    )
    .join('');

export const normalizeFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, fileName?: string) => void,
): void => {
  const fileExtName = file.originalname.split('.').pop();

  callback(null, `${generateId()}.${fileExtName}`);
};

export const fileStorage = diskStorage({
  destination: './uploads',
  filename: normalizeFileName,
});
