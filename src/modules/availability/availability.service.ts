import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NO_ROWS_AFFECTED } from '@shared/consts';
import DoctorService from 'modules/doctor/doctor.service';
import { Role } from '@shared/enums';
import Availability from './entity/availability.entity';

@Injectable()
export default class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
    private readonly doctorService: DoctorService,
  ) {}

  async getAvailabilities(doctorId: number): Promise<Availability[]> {
    try {
      const availabilities = await this.availabilityRepository
        .createQueryBuilder('availability')
        .select([
          'availability.title',
          'availability.uuid',
          'availability.start',
          'availability.end',
        ])
        .leftJoin('availability.doctor', 'doctor')
        .where('doctor.id = :id', { id: doctorId })
        .getMany();
      return availabilities;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createAvailability(
    doctorId: number,
    availability: Availability,
  ): Promise<Availability> {
    try {
      const doctor = await this.doctorService.getDoctorByID(doctorId);

      const newAvailability = { ...availability };
      newAvailability.doctor = doctor;

      return await this.availabilityRepository.save(newAvailability);
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAvailability(
    doctorId: number,
    availabilityId: string,
  ): Promise<void> {
    try {
      const result = await this.availabilityRepository
        .createQueryBuilder()
        .delete()
        .from(Availability)
        .where('uuid = :uuid', { uuid: availabilityId })
        .andWhere('doctor.id = :doctorId', { doctorId })
        .execute();

      if (result.affected === NO_ROWS_AFFECTED) {
        throw new NotFoundException(
          `Availability with uuid ${availabilityId} not found`,
        );
      }
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findDoctorsByAvailabilityAndSpeciality(
    startDatetime: string,
    endDatetime: string,
    specialization?: string,
  ): Promise<Availability[]> {
    try {
      const availabilities = await this.availabilityRepository
        .createQueryBuilder('availability')
        .select([
          'availability',
          'doctor.id',
          'doctor.specialization',
          'doctor.role',
        ])
        .innerJoin('availability.doctor', 'doctor')
        .andWhere(
          '(availability.start >= :start AND availability.start < :end) OR (availability.end > :start AND availability.end <= :end)',
        )
        .setParameter('start', startDatetime)
        .setParameter('end', endDatetime)
        .getMany();

      let filteredAvailabilities = availabilities.filter(
        (availability) => availability.doctor.role === Role.Remote,
      );

      if (specialization) {
        filteredAvailabilities = filteredAvailabilities.filter(
          (availability) =>
            availability.doctor.specialization === Number(specialization),
        );
      }

      return filteredAvailabilities;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
