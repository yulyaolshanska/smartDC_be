import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Query } from 'express-serve-static-core';
import Note from './entity/note.entity';
import CreateNoteDto from './dto/create-note.dto';
import { File } from './entity/file.entity';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
    @InjectRepository(File) private filesRepository: Repository<File>,
  ) {}

  async create(createNoteDto: CreateNoteDto, file: Express.Multer.File) {
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

        return {
          note: newNote.generatedMaps[0] as Note,
          file: newFile.generatedMaps[0] as File,
        };
      } else {
        const newNote = await this.notesRepository
          .createQueryBuilder()
          .insert()
          .into(Note)
          .values({
            ...createNoteDto,
          })
          .execute();
        return {
          note: newNote.generatedMaps[0] as Note,
        };
      }
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(query: Query) {
    try {
      const qb = this.notesRepository.createQueryBuilder('notes');
      const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      let sortBy: string;
      if (query.sortBy === 'Date') sortBy = 'createdAt';
      if (query.sortBy === 'Doctor') sortBy = 'doctorId';

      qb.select(['notes', 'doctor.firstName', 'doctor.lastName'])
        .where('notes.note like :searchString', {
          searchString: `%${query.searchString}%`,
        })
        .leftJoin('notes.doctorId', 'doctor')
        .leftJoinAndSelect('notes.file', 'file')
        .orderBy(`notes.${sortBy}`, sortOrder)
        .skip(Number(query.skipAmount))
        .take(Number(query.limit));

      const notes = await qb.getMany();
      return notes;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async downloadFile(filename: string, res: Response) {
    const filePath = `./uploads/${filename}`;
    const fileStream = fs.createReadStream(filePath);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    fileStream.pipe(res);
  }
}
