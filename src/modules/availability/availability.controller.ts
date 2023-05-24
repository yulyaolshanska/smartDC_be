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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import Availability from './entity/availability.entity';
import AvailabilityService from './availability.service';

@UseGuards(JwtPatchGuard)
@ApiTags('Availability')
@Controller('availability')
export default class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @ApiOperation({ summary: 'Getting all doctor availabilities' })
  @ApiResponse({ status: 200, type: [Availability] })
  @Get('/:id')
  async getAvailabilitiesForDoctor(
    @Param('id') id: number,
  ): Promise<Availability[]> {
    return this.availabilityService.getAvailabilities(id);
  }

  @ApiOperation({ summary: 'Create doctor availability' })
  @ApiResponse({ status: 200, type: Availability })
  @Post('/:id')
  async createAvailability(
    @Param('id') doctorId: number,
    @Body() availability: Omit<Availability, 'doctorId'>,
  ): Promise<Availability> {
    return this.availabilityService.createAvailability(doctorId, availability);
  }

  @ApiOperation({ summary: 'Delete doctor availability' })
  @ApiResponse({ status: 204 })
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

  @ApiOperation({
    summary: 'Find available doctors by datetime and speciality',
  })
  @ApiResponse({ status: 200, type: [Availability] })
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

  @ApiOperation({ summary: 'Find available doctors by speciality' })
  @ApiResponse({ status: 200, type: [Availability] })
  @Get('/specialization/:specialization')
  async findDoctorsWithSpecialization(
    @Param('specialization') specialization: string,
  ): Promise<Availability[]> {
    return this.availabilityService.findBySpecialization(specialization);
  }
}
