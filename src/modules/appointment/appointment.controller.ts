import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtPatchGuard from 'modules/auth/utils/PatchGuard';
import Patient from 'modules/patient/entity/patient.entity';
import { TEN } from '@shared/consts';
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

  @ApiOperation({ summary: "Find doctor's today appointments" })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/doctor/:id/today/:all?')
  async getAppointmentsByDoctorIdToday(
    @Param('id') id: number,
    @Query('limit') limit = TEN,
    @Param('all') all = false,
  ): Promise<{ appointments: Appointment[]; count: number }> {
    return this.appointmentService.getAppointmentsByDoctorIdToday(
      id,
      limit,
      all,
    );
  }

  @ApiOperation({ summary: "Find doctor's appointments" })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/doctor/:id/month/:year/:month')
  async getAppointmentsByDoctorIdAndMonth(
    @Param('id') id: number,
    @Param('year') year: number,
    @Param('month') month: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByDoctorIdAndMonth(
      id,
      year,
      month,
    );
  }

  @ApiOperation({ summary: "Find patient's appointments" })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/patient/:id')
  async getAppointmentsByPatientId(
    @Param('id') id: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByPatientId(id);
  }

  @ApiOperation({ summary: "Find patient's appointments for week" })
  @Get('/patient/:id/week/:year/:week')
  async getAppointmentsByPatientIdAndWeek(
    @Param('id') id: number,
    @Param('year') year: number,
    @Param('week') week: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByPatientIdAndWeek(
      id,
      year,
      week,
    );
  }

  @ApiOperation({ summary: "Find doctor patient's who have appointments" })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/doctor/:id/patients')
  async getAppointmentsWithPatients(
    @Param('id') id: number,
    @Query('limit') limit?: number,
  ): Promise<Patient[]> {
    return this.appointmentService.getPatientsByDoctorIdAppointments(id, limit);
  }
}
