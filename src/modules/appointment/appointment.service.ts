import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import DoctorService from 'modules/doctor/doctor.service';
import PatientService from 'modules/patient/patient.service';
import Patient from 'modules/patient/entity/patient.entity';
import Appointment from './entity/appointment.entity';
import CreateAppointmentDto from './dto/create-appintment.dto';

@Injectable()
export default class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      const { localDoctorId, remoteDoctorId, patientId, ...rest } =
        createAppointmentDto;

      const localDoctor = await this.doctorService.getDoctorByID(localDoctorId);
      const remoteDoctor = await this.doctorService.getDoctorByID(
        remoteDoctorId,
      );
      const patient = await this.patientService.getPatientById(patientId);

      const appointment = {
        localDoctor,
        remoteDoctor,
        patient,
        ...rest,
      };

      return await this.appointmentRepository
        .createQueryBuilder()
        .insert()
        .into(Appointment)
        .values(appointment)
        .execute()
        .then((result) => {
          const { generatedMaps } = result;
          const [generatedMap] = generatedMaps;
          const { id } = generatedMap;

          return { ...appointment, id };
        });
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentsByDoctorId(id: number): Promise<Appointment[]> {
    try {
      const queryBuilder: SelectQueryBuilder<Appointment> =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where(
        'appointment.localDoctorId = :doctorId OR appointment.remoteDoctorId = :doctorId',
        { doctorId: id },
      );
      queryBuilder.leftJoinAndSelect('appointment.localDoctor', 'localDoctor');
      queryBuilder.leftJoinAndSelect(
        'appointment.remoteDoctor',
        'remoteDoctor',
      );
      queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');
      queryBuilder.select([
        'appointment.id',
        'appointment.startTime',
        'appointment.endTime',
        'appointment.zoomLink',
        'localDoctor.id',
        'remoteDoctor.id',
        'patient.id',
      ]);

      return await queryBuilder.getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentsByPatientId(id: number): Promise<Appointment[]> {
    try {
      const queryBuilder: SelectQueryBuilder<Appointment> =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where('appointment.patientId = :patientId', {
        patientId: id,
      });
      queryBuilder.leftJoinAndSelect('appointment.localDoctor', 'localDoctor');
      queryBuilder.leftJoinAndSelect(
        'appointment.remoteDoctor',
        'remoteDoctor',
      );
      queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');
      queryBuilder.select([
        'appointment.id',
        'appointment.startTime',
        'appointment.endTime',
        'appointment.zoomLink',
        'localDoctor.id',
        'remoteDoctor.id',
        'patient.id',
      ]);

      return await queryBuilder.getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPatientsByDoctorIdAppointments(
    doctorId: number,
  ): Promise<Patient[]> {
    try {
      const doctor = await this.doctorService.getDoctorByID(doctorId);

      const appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .where(
          'appointment.localDoctorId = :id OR appointment.remoteDoctorId = :id',
          { id: doctor.id },
        )
        .getMany();

      const patients: Patient[] = appointments.map(
        (appointment) => appointment.patient,
      );

      return patients;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
