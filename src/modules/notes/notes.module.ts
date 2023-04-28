import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from 'modules/auth/auth.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import Note from './entity/note.entity';
import { File } from './entity/file.entity';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
  imports: [TypeOrmModule.forFeature([Note, File]), AuthModule],
})
export class NotesModule {}
