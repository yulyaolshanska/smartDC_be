import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Res,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Response } from 'express';

import JwtAuthGuard from 'modules/auth/utils/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import Note from './entity/note.entity';

import NotesService from './notes.service';
import CreateNoteDto from './dto/create-note.dto';
import { fileStorage } from './storage';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 5; // eslint-disable-line no-magic-numbers
@Controller('notes')
@UseGuards(JwtAuthGuard)
@ApiTags('Notes')
export default class NotesController {
  constructor(private notesService: NotesService) {}

  // get all notes

  @ApiOperation({ summary: 'Getting All Notes' })
  @ApiResponse({ status: 200, type: [Note] })
  @Get('/all')
  getAllNotes(
    @Query() query: ExpressQuery,
  ): Promise<{ notes: Note[]; count: number }> {
    return this.notesService.findAll(query);
  }

  // create a note

  @ApiOperation({ summary: 'Create a note' })
  @ApiResponse({ status: 200, type: [Note] })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        doctorId: { type: 'string' },
        patientId: { type: 'stirng' },
        note: { type: 'string' },
      },
      required: ['doctorId', 'patientId', 'note'],
    },
  })
  @ApiBearerAuth()
  @Post('/create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  createNote(
    @Body() createNoteDto: CreateNoteDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_BYTES }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<void> {
    return this.notesService.create(createNoteDto, file);
  }

  // file download
  @ApiOperation({ summary: 'Download a file' })
  @ApiResponse({ status: 200, type: [Note] })
  @Get('/file/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.notesService.downloadFile(filename, res);
  }
}
