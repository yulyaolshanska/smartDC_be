import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FIFTEEN,
  FIVE_NINE,
  NO_ROWS_AFFECTED,
  ONE,
  SLICE_START,
  TWENTY_THREE,
  ZERO,
} from '@shared/consts';
import DoctorService from 'modules/doctor/doctor.service';
import { Role } from '@shared/enums';
import Availability from './entity/availability.entity';

export interface Notification {
  message: string;
  action: string;
  actionUrl: string;
}

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
    limit?: number,
  ): Promise<Availability[]> {
    try {
      const availabilities = await this.availabilityRepository
        .createQueryBuilder('availability')
        .select([
          'availability',
          'doctor.id',
          'doctor.specialization',
          'doctor.role',
          'doctor.firstName',
          'doctor.lastName',
          'doctor.country',
          'doctor.city',
          'doctor.photoUrl',
        ])
        .innerJoin('availability.doctor', 'doctor')
        .andWhere(
          '(availability.start >= :start AND availability.start < :end) OR (availability.end > :start AND availability.end <= :end)',
        )
        .setParameter('start', startDatetime)
        .setParameter('end', endDatetime)
        .getMany();

      const filteredAvailabilities = availabilities.filter(
        (availability) =>
          availability.doctor.role === Role.Remote &&
          (specialization
            ? availability.doctor.specialization === Number(specialization)
            : true),
      );

      return limit
        ? filteredAvailabilities.slice(SLICE_START, limit)
        : filteredAvailabilities;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBySpecialization(specialization: string): Promise<Availability[]> {
    try {
      if (!specialization) {
        throw new HttpException(
          'A valid specialization is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      const availabilities = await this.availabilityRepository
        .createQueryBuilder('availability')
        .select([
          'availability',
          'doctor.id',
          'doctor.specialization',
          'doctor.role',
        ])
        .innerJoin('availability.doctor', 'doctor')
        .getMany();

      const filteredAvailabilities = availabilities.filter(
        (availability) =>
          availability.doctor.role === Role.Remote &&
          availability.doctor.specialization === Number(specialization),
      );

      return filteredAvailabilities;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getNotifications(doctorId: number): Promise<Notification[]> {
    const doctor = await this.doctorService.getDoctorByID(doctorId);

    if (doctor.role !== Role.Remote) {
      throw new HttpException(
        'Only remote doctors are eligible for notifications',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const nextMonthAvailability = await this.getNextMonthAvailability(doctorId);
    const notifications: Notification[] = [];

    if (!nextMonthAvailability || nextMonthAvailability.length === ZERO) {
      const notification = {
        message: 'Fill up your schedule to be able to conduct meetings',
        action: 'Go to Availability',
        actionUrl: '/availability',
      };

      notifications.push(notification);
    } else if (nextMonthAvailability.length <= FIFTEEN) {
      const notification = {
        message: 'Manage your schedule for the upcoming month',
        action: 'Go to Availability',
        actionUrl: '/availability',
      };

      notifications.push(notification);
    }

    return notifications;
  }

  private async getNextMonthAvailability(
    doctorId: number,
  ): Promise<Availability[]> {
    const currentDate = new Date();
    const nextMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + ONE,
    );

    const nextMonthStartDate = new Date(
      nextMonthDate.getFullYear(),
      nextMonthDate.getMonth(),
      ONE,
    );
    const nextMonthEndDate = new Date(
      nextMonthDate.getFullYear(),
      nextMonthDate.getMonth() + ONE,
      ZERO,
      TWENTY_THREE,
      FIVE_NINE,
      FIVE_NINE,
    );

    const availabilities = await this.availabilityRepository
      .createQueryBuilder('availability')
      .where('availability.doctor = :doctorId', { doctorId })
      .andWhere('availability.start >= :start', { start: nextMonthStartDate })
      .andWhere('availability.end <= :end', { end: nextMonthEndDate })
      .getMany();

    return availabilities;
  }
}
