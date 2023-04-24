import {
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import JwtPatchGuard from 'modules/auth/utils/PatchGuard';
import DoctorService from './doctor.service';
import Doctor, { Availability } from './entity/doctor.entity';
import CreateDoctorDto from './dto/create-doctor.dto';

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

  @Patch('/:id')
  @UseGuards(JwtPatchGuard)
  updateOne(
    @Param('id') id: number,
    @Body() doctorDto: Partial<CreateDoctorDto>,
  ): Promise<Doctor> {
    return this.doctorService.updateDoctor(id, doctorDto);
  }

  @UseGuards(JwtPatchGuard)
  @Put('/:id/availability')
  addAvailability(
    @Param('id') doctorId: number,
    @Body() availabilities: Omit<Availability, 'doctorId'>[],
  ): Promise<Availability[]> {
    return this.doctorService.updateDoctorAvailability(
      doctorId,
      availabilities,
    );
  }

  @UseGuards(JwtPatchGuard)
  @Delete('/:id/availability/:uuid')
  deleteAvailability(
    @Param('id') doctorId: number,
    @Param('uuid') uuid: string,
  ): Promise<void> {
    return this.doctorService.deleteDoctorAvailability(doctorId, uuid);
  }
}
