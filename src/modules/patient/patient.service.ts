import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Patient from './entity/patient.entity';
import CreatePatientDto from './dto/create-patient.dto';

@Injectable()
export default class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async getAllPatients(): Promise<Patient[]> {
    try {
      return await this.patientRepository
        .createQueryBuilder('patient')
        .getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const newPatient = await this.patientRepository
        .createQueryBuilder()
        .insert()
        .into(Patient)
        .values({ ...createPatientDto })
        .execute();

      return newPatient.generatedMaps[0] as Patient;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
