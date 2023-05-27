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

@UseGuards(JwtPatchGuard)
@ApiTags('Patient')
@Controller('patient')
export default class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Getting all patients' })
  @ApiResponse({ status: 200, type: [Patient] })
  @Get()
  getAll(): Promise<Patient[]> {
    return this.patientService.getAllPatients();
  }

  @ApiOperation({ summary: 'Patient creation' })
  @ApiResponse({ status: 201, type: Patient })
  @Post()
  postPatient(@Body() patientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.createPatient(patientDto);
  }

  @ApiOperation({ summary: 'Patient update' })
  @ApiResponse({ status: 200, type: Patient })
  @Patch('/:id')
  updateOne(
    @Param('id') id: number,
    @Body() patientDto: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    return this.patientService.updatePatient(id, patientDto);
  }

  @ApiOperation({ summary: 'Getting a patient by ID' })
  @ApiResponse({ status: 200, type: Patient })
  @Get('/:id')
  getOne(@Param('id') id: number): Promise<Patient> {
    console.log(123);
    return this.patientService.getPatientById(id);
  }
}
