import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entity/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  createDoctor(doctor: Doctor): Promise<Doctor> {
    return this.doctorRepository.save(doctor);
  }

  findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  findOne(id: number): Promise<Doctor | null> {
    return this.doctorRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }
}