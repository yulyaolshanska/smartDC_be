import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtPatchGuard from 'modules/auth/utils/PatchGuard';
import PatientService from './patient.service';
import Patient from './entity/patient.entity';
import CreatePatientDto from './dto/create-patient.dto';

@ApiTags('Patient')
@Controller('patient')
export default class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Getting all patients' })
  @ApiResponse({ status: 200, type: [Patient] })
  @Get()
  @UseGuards(JwtPatchGuard)
  getAll(): Promise<Patient[]> {
    return this.patientService.getAllPatients();
  }

  @ApiOperation({ summary: 'Patient creation' })
  @ApiResponse({ status: 201, type: Patient })
  @Post()
  @UseGuards(JwtPatchGuard)
  postPatient(@Body() patientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.createPatient(patientDto);
  }

  @ApiOperation({ summary: 'Patient update' })
  @ApiResponse({ status: 200, type: Patient })
  @Patch('/:id')
  @UseGuards(JwtPatchGuard)
  updateOne(
    @Param('id') id: number,
    @Body() patientDto: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    return this.patientService.updatePatient(id, patientDto);
  }
}
