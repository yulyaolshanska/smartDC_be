import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DoctorService from 'modules/doctor/doctor.service';
import PatientService from 'modules/patient/patient.service';
import Appointment from './entity/appointment.entity';
import CreateAppointmentDto from './dto/create-appointment.dto';

const KJUR = require('jsrsasign');

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

  async startAppointments() {
    const currentDate = new Date();
    let diffTime: number;
    try {
      const nextAppointment = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.startTime > :currentDate', { currentDate })
        .orderBy('appointment.startTime', 'ASC')
        .getOne();
      if (nextAppointment) {
        diffTime = Number(nextAppointment.startTime) - Number(currentDate);
      }

      if (nextAppointment) {
        return nextAppointment;
      }
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAppointments(): Promise<void> {
    try {
      const currentDate = new Date();
      const appointmentsToDelete = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.endTime < :currentDate', { currentDate })
        .getMany();

      await this.appointmentRepository.remove(appointmentsToDelete);
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getRoomName(id: number, startTime: Date): string {
    const oHeader = { alg: 'HS256', typ: 'JWT' };

    return KJUR.jws.JWS.sign(
      'HS256',
      oHeader,
      JSON.stringify(id),
      JSON.stringify(startTime),
    ).substring(0, 35);
  }
}
