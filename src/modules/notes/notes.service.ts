import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Query } from 'express-serve-static-core';
import { Response } from 'express';
import * as fs from 'fs';
import { DATE, DESC, DOCTOR } from '@shared/consts';
import Note from './entity/note.entity';
import CreateNoteDto from './dto/create-note.dto';
import File from './entity/file.entity';

@Injectable()
export default class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
    @InjectRepository(File) private filesRepository: Repository<File>,
    private dataSource: DataSource,
  ) {}

  async create(
    createNoteDto: CreateNoteDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (file) {
        const newNote = await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(Note)
          .values({
            ...createNoteDto,
          })
          .execute();

        const newFile = await queryRunner.manager
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

        await queryRunner.manager.update(Note, newNote.generatedMaps[0].id, {
          file: newFile.generatedMaps[0].id,
        });
      } else {
        const newNote = await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(Note)
          .values({
            ...createNoteDto,
            file: null,
          })
          .execute();
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    query: Query,
    patientId: number,
  ): Promise<{ notes: Note[]; count: number; countWithoutAnyParams: number }> {
    try {
      const qb = this.notesRepository.createQueryBuilder('notes');

      const sortOrder = query.sortOrder === DESC ? 'DESC' : 'ASC';

      let sortBy: string;
      if (query.sortBy === DATE) sortBy = 'createdAt';
      if (query.sortBy === DOCTOR) sortBy = 'doctor';

      const [notes, count] = await qb
        .select(['notes', 'doctor.firstName', 'doctor.lastName'])
        .where('notes.note like :searchString', {
          searchString: `%${query.searchString}%`,
        })
        .andWhere('notes.patientId = :patientId', {
          patientId,
        })
        .leftJoin('notes.doctor', 'doctor')
        .leftJoinAndSelect('notes.file', 'file')
        .orderBy(`notes.${sortBy}`, sortOrder)
        .skip(Number(query.skipAmount))
        .take(Number(query.limit))
        .getManyAndCount();

      const countWithoutAnyParams = await this.notesRepository
        .createQueryBuilder('notes')
        .where('notes.patientId = :patientId', {
          patientId,
        })
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
