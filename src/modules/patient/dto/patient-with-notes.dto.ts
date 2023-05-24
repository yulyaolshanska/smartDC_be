import { ApiProperty } from '@nestjs/swagger';
import CreateNoteDto from 'modules/notes/dto/create-note.dto';
import Note from 'modules/notes/entity/note.entity';
import CreatePatientDto from 'modules/patient/dto/create-patient.dto';

export default class PatientWithNotes extends CreatePatientDto {
  @ApiProperty({ type: [CreateNoteDto] })
  notes: Note[];
}
