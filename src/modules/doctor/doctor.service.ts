import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NO_ROWS_AFFECTED } from 'src/shared/consts';
import { Repository } from 'typeorm';
import CreateDoctorDto from './dto/create-doctor.dto';
import Doctor from './entity/doctor.entity';

@Injectable()
export default class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    try {
      const doctor = this.doctorRepository.create(createDoctorDto);

      await this.doctorRepository
        .createQueryBuilder()
        .insert()
        .into(Doctor)
        .values(doctor)
        .execute();

      return doctor;
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

  async getDoctorByID(id: number): Promise<Doctor | null> {
    try {
      const doctor = await this.doctorRepository
        .createQueryBuilder('doctor')
        .where('doctor.id = :id', { id })
        .getOne();

      if (!doctor) {
        throw new NotFoundException(`Doctor with id ${id} not found`);
      }

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
}
