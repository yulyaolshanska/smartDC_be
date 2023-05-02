import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateAppointmentDto from './dto/create-appintment.dto';
import AppointmentService from './appointment.service';
import Appointment from './entity/appointment.entity';

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
}
