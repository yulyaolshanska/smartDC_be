import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateDoctorDto from './dto/create-doctor.dto';
import Doctor from './entity/doctor.entity';

@Injectable()
export default class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async createDoctor(doctorDto: CreateDoctorDto): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepository.create(doctorDto);
      this.doctorRepository.save(doctor);
      return doctor;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllDoctors(): Promise<Doctor[]> {
    try {
      const doctors = await this.doctorRepository.find();
      return doctors;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDoctorByID(id: number): Promise<Doctor | null> {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) throw new Error(`Can't find doctor with id ${id}`);
      return doctor;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteDoctorById(id: number): Promise<string> {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) throw new Error(`Can't find doctor with id ${id}`);
      await this.doctorRepository.delete(id);
      return `Doctor with id ${id} was deleted`;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
