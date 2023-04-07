import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import DoctorService from './doctor.service';
import CreateDoctorDto from './dto/create-doctor.dto';
import Doctor from './entity/doctor.entity';

@Controller('create_doctor')
export default class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
}
