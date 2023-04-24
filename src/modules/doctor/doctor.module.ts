import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from 'modules/auth/auth.module';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import DoctorController from './doctor.controller';
import DoctorService from './doctor.service';
import Doctor from './entity/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor]),
    forwardRef(() => AuthModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const { originalname } = file;
          const extension: string = originalname.split('.').pop();
          const filename: string = uuidv4();

          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  ],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export default class DoctorModule {}
