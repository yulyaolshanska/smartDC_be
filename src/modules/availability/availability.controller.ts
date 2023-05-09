import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import JwtPatchGuard from 'modules/auth/utils/PatchGuard';
import Availability from './entity/availability.entity';
import AvailabilityService from './availability.service';

@UseGuards(JwtPatchGuard)
@Controller('availability')
export default class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get('/:id')
  async getAvailabilitiesForDoctor(
    @Param('id') id: number,
  ): Promise<Availability[]> {
    return this.availabilityService.getAvailabilities(id);
  }

  @Post('/:id')
  async createAvailability(
    @Param('id') doctorId: number,
    @Body() availability: Omit<Availability, 'doctorId'>,
  ): Promise<Availability> {
    return this.availabilityService.createAvailability(doctorId, availability);
  }

  @Delete('/:id/:uuid')
  async deleteAvailability(
    @Param('id') doctorId: number,
    @Param('uuid') availabilityUuid: string,
  ): Promise<void> {
    return this.availabilityService.deleteAvailability(
      doctorId,
      availabilityUuid,
    );
  }

  @Get()
  async findDoctorsByAvailabilityandSpeciality(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('specialization') specialization?: string,
    @Query('limit') limit?: number,
  ): Promise<Availability[]> {
    return this.availabilityService.findDoctorsByAvailabilityAndSpeciality(
      start,
      end,
      specialization,
      limit,
    );
  }

  @Get('/specialization/:specialization')
  async findDoctorsWithSpecialization(
    @Param('specialization') specialization: string,
  ): Promise<Availability[]> {
    return this.availabilityService.findBySpecialization(specialization);
  }
}
