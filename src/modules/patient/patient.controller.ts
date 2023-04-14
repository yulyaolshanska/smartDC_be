import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  getAll(): Promise<Patient[]> {
    return this.patientService.getAllPatients();
  }

  @ApiOperation({ summary: 'Patient creation' })
  @ApiResponse({ status: 201, type: Patient })
  @Post()
  postPatient(@Body() patientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.createPatient(patientDto);
  }
}
