import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtPatchGuard from 'modules/auth/utils/PatchGuard';
import CreateAppointmentDto from './dto/create-appointment.dto';
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
    @Body() appointment: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(appointment);
  }

  @ApiOperation({ summary: "Find doctor's appointments" })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/doctor/:id')
  async getAppointmentsByDoctorId(
    @Param('id') id: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByDoctorId(id);
  }

  @ApiOperation({ summary: "Find patient's appointments" })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/patient/:id')
  async getAppointmentsByPatientId(
    @Param('id') id: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByPatientId(id);
  }

  @Get('start')
  startAndDeleteAppointments() {
    this.appointmentService.startAppointments();
    this.appointmentService.deleteAppointments();
    return 'Starting appointments';
  }
}
