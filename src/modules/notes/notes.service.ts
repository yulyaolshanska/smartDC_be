import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Query } from 'express-serve-static-core';
import { Response } from 'express';
import * as fs from 'fs';
import Note from './entity/note.entity';
import CreateNoteDto from './dto/create-note.dto';
import File from './entity/file.entity';

@Injectable()
export default class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
    @InjectRepository(File) private filesRepository: Repository<File>,
  ) {}

  async create(
    createNoteDto: CreateNoteDto,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      if (file) {
        const newNote = await this.notesRepository
          .createQueryBuilder()
          .insert()
          .into(Note)
          .values({
            ...createNoteDto,
          })
          .execute();
        const newFile = await this.filesRepository
          .createQueryBuilder()
          .insert()
          .into(File)
          .values({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            note: newNote.generatedMaps[0].id,
          })
          .execute();

        await this.notesRepository.update(newNote.generatedMaps[0].id, {
          file: newFile.generatedMaps[0].id,
        });
      } else {
        const newNote = await this.notesRepository
          .createQueryBuilder()
          .insert()
          .into(Note)
          .values({
            ...createNoteDto,
          })
          .execute();
      }
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    query: Query,
  ): Promise<{ notes: Note[]; count: number; countWithoutAnyParams: number }> {
    try {
      const qb = this.notesRepository.createQueryBuilder('notes');
      const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      let sortBy: string;
      if (query.sortBy === 'Date') sortBy = 'createdAt';
      if (query.sortBy === 'Doctor') sortBy = 'doctor';

      const [notes, count] = await qb
        .select(['notes', 'doctor.firstName', 'doctor.lastName'])
        .where('notes.note like :searchString', {
          searchString: `%${query.searchString}%`,
        })
        .leftJoin('notes.doctor', 'doctor')
        .leftJoinAndSelect('notes.file', 'file')
        .orderBy(`notes.${sortBy}`, sortOrder)
        .skip(Number(query.skipAmount))
        .take(Number(query.limit))
        .getManyAndCount();

      const countWithoutAnyParams = await this.notesRepository
        .createQueryBuilder('notes')
        .getCount();

      return { notes, count, countWithoutAnyParams };
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async downloadFile(filename: string, res: Response): Promise<void> {
    try {
      const filePath = `./uploads/${filename}`;
      const fileStream = fs.createReadStream(filePath);

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      fileStream.pipe(res);
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
