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
        .leftJoinAndSelect(
          'patient.notes',
          'notes',
          'notes.createdAt = (SELECT MAX(n.createdAt) FROM note n WHERE n.patientId = patient.id)',
        )
        .getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPatient(patient: CreatePatientDto): Promise<Patient> {
    try {
      const newPatient = await this.patientRepository
        .createQueryBuilder()
        .insert()
        .into(Patient)
        .values({ ...patient })
        .execute();

      return newPatient.generatedMaps[0] as Patient;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePatient(
    patientId: number,
    patient: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    try {
      const updatedPatient = await this.patientRepository.findOneOrFail({
        where: { id: patientId },
      });
      Object.assign(updatedPatient, patient);

      return await this.patientRepository.save(updatedPatient);
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPatientById(patientId: number): Promise<Patient> {
    try {
      const queryResult = await this.patientRepository
        .createQueryBuilder('patient')
        .leftJoinAndSelect(
          'patient.notes',
          'note',
          'note.createdAt = (SELECT MAX(n.createdAt) FROM note n WHERE n.patientId = patient.id)',
        )
        .where('patient.id = :patientId', { patientId })
        .getOneOrFail();

      return queryResult;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
