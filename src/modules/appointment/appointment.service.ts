import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DoctorService from 'modules/doctor/doctor.service';
import PatientService from 'modules/patient/patient.service';
import Appointment from './entity/appointment.entity';
import CreateAppointmentDto from './dto/create-appointment.dto';

@Injectable()
export default class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {}

  async createAppointment(
    appointment: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      const { localDoctorId, remoteDoctorId, patientId, ...rest } = appointment;

      await Promise.all([
        this.patientService.getPatientById(patientId),
        this.doctorService.getDoctorByID(localDoctorId),
        this.doctorService.getDoctorByID(remoteDoctorId),
      ]);

      const newAppointment = this.appointmentRepository.create({
        localDoctorId,
        remoteDoctorId,
        patientId,
        ...rest,
      });

      const savedAppointment = await this.appointmentRepository.save(
        newAppointment,
      );

      return { ...savedAppointment, id: savedAppointment.id };
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // TODO: can be used for getting appointments for today, week and month
  async getAppointmentsByDoctorId(id: number): Promise<Appointment[]> {
    try {
      const queryBuilder =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where(
        'appointment.localDoctorId = :doctorId OR appointment.remoteDoctorId = :doctorId',
        { doctorId: id },
      );
      queryBuilder.select([
        'appointment.id',
        'appointment.startTime',
        'appointment.endTime',
        'appointment.zoomLink',
        'appointment.localDoctorId',
        'appointment.remoteDoctorId',
        'appointment.patientId',
      ]);
      const appointments = await queryBuilder.getMany();
      return appointments;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // TODO: can be used for getting appointments for today, week and month
  async getAppointmentsByPatientId(id: number): Promise<Appointment[]> {
    try {
      const queryBuilder =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where('appointment.patientId = :patientId', {
        patientId: id,
      });
      queryBuilder.select([
        'appointment.id',
        'appointment.startTime',
        'appointment.endTime',
        'appointment.zoomLink',
        'appointment.localDoctorId',
        'appointment.remoteDoctorId',
        'appointment.patientId',
      ]);
      const appointments = await queryBuilder.getMany();
      return appointments;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
