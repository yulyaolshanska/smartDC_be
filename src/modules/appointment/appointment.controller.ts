import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtPatchGuard from 'modules/auth/utils/PatchGuard';
import CreateAppointmentDto from './dto/create-appintment.dto';
import AppointmentService from './appointment.service';
import Appointment from './entity/appointment.entity';

@UseGuards(JwtPatchGuard)
@ApiTags('Appointment')
@Controller('appointment')
export default class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @ApiOperation({ summary: 'Appointment creation' })
  @ApiResponse({ status: 201, type: Appointment })
  @Post()
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @ApiOperation({ summary: "Find doctor's appointments" })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/:id')
  async getAppointmentsByDoctorId(@Param('id') id: number): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByDoctorId(id);
  }
}
