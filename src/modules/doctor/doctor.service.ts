import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { BACKWARD, FORWARD, NO_ROWS_AFFECTED } from 'shared/consts';
import CreateDoctorDto from './dto/create-doctor.dto';
import Doctor, { Availability } from './entity/doctor.entity';

@Injectable()
export default class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async createDoctor(
    createDoctorDto: CreateDoctorDto,
    link: string,
  ): Promise<Doctor> {
    try {
      const newDoctor = await this.doctorRepository
        .createQueryBuilder()
        .insert()
        .into(Doctor)
        .values({ ...createDoctorDto, activationLink: link })
        .execute();

      return newDoctor.generatedMaps[0] as Doctor;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDoctorByEmail(email: string): Promise<Doctor> {
    try {
      const user = await this.doctorRepository
        .createQueryBuilder('doctor')
        .where('doctor.email = :email', { email })
        .getOne();

      if (!user) return null;

      return user;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllDoctors(): Promise<Doctor[]> {
    try {
      return await this.doctorRepository.createQueryBuilder('doctor').getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDoctorByID(doctorId: number): Promise<Doctor | null> {
    try {
      const doctor = await this.doctorRepository.findOneOrFail({
        where: { id: doctorId },
      });

      return doctor;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteDoctorById(id: number): Promise<void> {
    try {
      const result = await this.doctorRepository
        .createQueryBuilder('doctor')
        .delete()
        .where('doctor.id = :id', { id })
        .execute();

      if (result.affected === NO_ROWS_AFFECTED) {
        throw new NotFoundException(`Doctor with id ${id} not found`);
      }
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateDoctor(
    doctorId: number,
    doctorDto: Partial<CreateDoctorDto>,
  ): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepository.findOneOrFail({
        where: { id: doctorId },
      });

      Object.assign(doctor, doctorDto);

      return await this.doctorRepository.save(doctor);
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateDoctorPhotoUrl(
    doctorId: number,
    photoUrl: string,
  ): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepository.findOneOrFail({
        where: { id: doctorId },
      });
      doctor.photoUrl = photoUrl;

      return await this.doctorRepository.save(doctor);
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateDoctorAvailability(
    doctorId: number,
    availabilities: Availability[],
  ): Promise<Availability[]> {
    try {
      const doctor = await this.doctorRepository.findOneOrFail({
        where: { id: doctorId },
      });
      doctor.availabilities = availabilities;

      await this.doctorRepository.save(doctor);

      return availabilities;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteDoctorAvailability(
    doctorId: number,
    availabilityUuid: string,
  ): Promise<void> {
    try {
      const doctor = await this.doctorRepository.findOneOrFail({
        where: { id: doctorId },
      });

      const index = doctor.availabilities.findIndex(
        (availability) => availability.uuid === availabilityUuid,
      );

      if (index === BACKWARD) {
        throw new NotFoundException(
          `Availability with uuid ${availabilityUuid} not found`,
        );
      }

      doctor.availabilities.splice(index, FORWARD);

      await this.doctorRepository.save(doctor);
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getImageByUrl(id: number): Promise<string> {
    const doctor = await this.getDoctorByID(id);
    const photoPath = doctor.photoUrl;
    const photoFile = readFileSync(join('src', '..', photoPath));
    const photoUrl = `data:image/png;base64,${photoFile.toString('base64')}`;
    return photoUrl;
  }
}
