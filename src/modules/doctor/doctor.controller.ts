import { Controller, Get, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import DoctorService from './doctor.service';
import Doctor from './entity/doctor.entity';

@Controller('create_doctor')
export default class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({ summary: 'Getting all doctors' })
  @ApiResponse({ status: 200, type: [Doctor] })
  @Get()
  getAll(): Promise<Doctor[]> {
    return this.doctorService.getAllDoctors();
  }

  @ApiOperation({ summary: 'Getting doctor by id' })
  @ApiResponse({ status: 200, type: Doctor })
  @Get('/:id')
  getOne(@Param('id') id: number): Promise<Doctor> {
    return this.doctorService.getDoctorByID(id);
  }

  @ApiOperation({ summary: 'Delete doctor by id' })
  @ApiResponse({ status: 200, type: [Doctor] })
  @Delete('/:id')
  deleteOne(@Param('id') id: number): Promise<void> {
    return this.doctorService.deleteDoctorById(id);
  }
}
