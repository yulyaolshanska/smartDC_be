import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import DoctorService from 'modules/doctor/doctor.service';
import PatientService from 'modules/patient/patient.service';
import Patient from 'modules/patient/entity/patient.entity';
import {
  MILLIS_PER_DAY,
  FIRST_DAY_OF_MONTH,
  LAST_DAY_OF_MONTH,
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  MINUTES_PER_HOUR,
  SECONDS_PER_MINUTE,
  ONE,
  TEN,
  THIRTY,
  ZERO,
  DATE_FORMAT,
} from '@shared/consts';
import * as moment from 'moment';
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
        localDoctor: { id: localDoctorId },
        remoteDoctor: { id: remoteDoctorId },
        patient: { id: patientId },
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

  async getAppointmentsByDoctorId(id: number): Promise<Appointment[]> {
    try {
      const doctor = await this.doctorService.getDoctorByID(id);

      const queryBuilder: SelectQueryBuilder<Appointment> =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where(
        'appointment.localDoctorId = :doctorId OR appointment.remoteDoctorId = :doctorId',
        { doctorId: doctor.id },
      );
      queryBuilder.leftJoinAndSelect('appointment.localDoctor', 'localDoctor');
      queryBuilder.leftJoinAndSelect(
        'appointment.remoteDoctor',
        'remoteDoctor',
      );
      queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');
      queryBuilder.leftJoinAndSelect(
        'patient.notes',
        'notes',
        'notes.createdAt = (SELECT MAX(n.createdAt) FROM note n WHERE n.patientId = patient.id)',
      );
      queryBuilder.select([
        'appointment',
        'localDoctor.id',
        'localDoctor.firstName',
        'localDoctor.lastName',
        'remoteDoctor.id',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'patient',
        'notes',
      ]);

      const appointments: Appointment[] = await queryBuilder.getMany();

      return appointments;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentsByDoctorIdToday(
    id: number,
    limit = TEN,
    all = false,
  ): Promise<{ appointments: Appointment[]; count: number }> {
    try {
      const doctor = await this.doctorService.getDoctorByID(id);
      const today = new Date();
      today.setHours(ZERO, ZERO, ZERO, ZERO);

      const queryBuilder: SelectQueryBuilder<Appointment> =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where(
        '(appointment.localDoctorId = :doctorId OR appointment.remoteDoctorId = :doctorId) AND appointment.startTime >= :today AND appointment.startTime < :tomorrow',
        {
          doctorId: doctor.id,
          today,
          tomorrow: new Date(today.getTime() + MILLIS_PER_DAY),
        },
      );
      queryBuilder.leftJoinAndSelect('appointment.localDoctor', 'localDoctor');
      queryBuilder.leftJoinAndSelect(
        'appointment.remoteDoctor',
        'remoteDoctor',
      );
      queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');
      queryBuilder.leftJoinAndSelect(
        'patient.notes',
        'notes',
        'notes.createdAt = (SELECT MAX(n.createdAt) FROM note n WHERE n.patientId = patient.id)',
      );
      queryBuilder.select([
        'appointment',
        'localDoctor.id',
        'localDoctor.firstName',
        'localDoctor.lastName',
        'remoteDoctor.id',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'patient',
        'notes',
      ]);

      if (!all) {
        queryBuilder.limit(limit);
      }

      const [appointments, count] = await queryBuilder.getManyAndCount();

      return { appointments, count };
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentsByDoctorIdAndMonth(
    id: number,
    year: number,
    month: number,
  ): Promise<Appointment[]> {
    try {
      const doctor = await this.doctorService.getDoctorByID(id);

      const startDate = new Date(year, month - ONE, FIRST_DAY_OF_MONTH);
      const endDate = new Date(year, month, LAST_DAY_OF_MONTH);
      const queryBuilder: SelectQueryBuilder<Appointment> =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where(
        '(appointment.localDoctorId = :doctorId OR appointment.remoteDoctorId = :doctorId) AND appointment.startTime >= :startDate AND appointment.startTime <= :endDate',
        {
          doctorId: doctor.id,
          startDate,
          endDate,
        },
      );
      queryBuilder.leftJoinAndSelect('appointment.localDoctor', 'localDoctor');
      queryBuilder.leftJoinAndSelect(
        'appointment.remoteDoctor',
        'remoteDoctor',
      );
      queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');
      queryBuilder.leftJoinAndSelect(
        'patient.notes',
        'notes',
        'notes.createdAt = (SELECT MAX(n.createdAt) FROM note n WHERE n.patientId = patient.id)',
      );
      queryBuilder.select([
        'appointment',
        'localDoctor.id',
        'localDoctor.firstName',
        'localDoctor.lastName',
        'remoteDoctor.id',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'patient',
        'notes',
      ]);

      const appointments: Appointment[] = await queryBuilder.getMany();

      return appointments;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async startAppointments(): Promise<Appointment> {
    this.deleteAppointments();
    const formattedCurrentTime = new Date(
      moment(new Date()).format(DATE_FORMAT), //TODO
    );

    try {
      const queryBuilder: SelectQueryBuilder<Appointment> =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where(
        'appointment.startTime > :formattedCurrentTime OR  appointment.endTime > :formattedCurrentTime',
        {
          formattedCurrentTime,
        },
      );
      queryBuilder.leftJoinAndSelect('appointment.localDoctor', 'localDoctor');
      queryBuilder.leftJoinAndSelect(
        'appointment.remoteDoctor',
        'remoteDoctor',
      );
      queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');
      queryBuilder.select([
        'appointment',
        'localDoctor.id',
        'localDoctor.firstName',
        'localDoctor.lastName',
        'remoteDoctor.id',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'patient',
      ]);

      const nextAppointment: Appointment = await queryBuilder
        .orderBy('appointment.startTime', 'ASC')
        .getOne();

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

  async getAppointmentsByPatientId(id: number): Promise<Appointment[]> {
    try {
      const patient = await this.patientService.getPatientById(id);

      const queryBuilder: SelectQueryBuilder<Appointment> =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where('appointment.patientId = :patientId', {
        patientId: patient.id,
      });
      queryBuilder.leftJoinAndSelect('appointment.localDoctor', 'localDoctor');
      queryBuilder.leftJoinAndSelect(
        'appointment.remoteDoctor',
        'remoteDoctor',
      );
      queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');
      queryBuilder.leftJoinAndSelect(
        'patient.notes',
        'notes',
        'notes.createdAt = (SELECT MAX(n.createdAt) FROM note n WHERE n.patientId = patient.id)',
      );
      queryBuilder.select([
        'appointment.id',
        'appointment.startTime',
        'appointment.endTime',
        'appointment.zoomLink',
        'localDoctor.id',
        'localDoctor.firstName',
        'localDoctor.lastName',
        'remoteDoctor.id',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'patient',
        'notes',
      ]);

      return await queryBuilder.getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentsByPatientIdAndWeek(
    id: number,
    year: number,
    week: number,
  ): Promise<Appointment[]> {
    try {
      const patient = await this.patientService.getPatientById(id);

      const firstDayOfYear = new Date(year, ZERO, ONE);
      const daysToAdd = (week - ONE) * DAYS_PER_WEEK;
      const startDate = new Date(
        firstDayOfYear.getFullYear(),
        ZERO,
        firstDayOfYear.getDate() + daysToAdd,
      );
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + (DAYS_PER_WEEK - ONE),
        HOURS_PER_DAY - ONE,
        MINUTES_PER_HOUR - ONE,
        SECONDS_PER_MINUTE - ONE,
      );

      const queryBuilder: SelectQueryBuilder<Appointment> =
        this.appointmentRepository.createQueryBuilder('appointment');
      queryBuilder.where('appointment.patientId = :patientId', {
        patientId: patient.id,
      });
      queryBuilder.andWhere(
        'appointment.startTime >= :startDate AND appointment.endTime <= :endDate',
        {
          startDate,
          endDate,
        },
      );
      queryBuilder.leftJoinAndSelect('appointment.localDoctor', 'localDoctor');
      queryBuilder.leftJoinAndSelect(
        'appointment.remoteDoctor',
        'remoteDoctor',
      );
      queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');
      queryBuilder.leftJoinAndSelect(
        'patient.notes',
        'notes',
        'notes.createdAt = (SELECT MAX(n.createdAt) FROM note n WHERE n.patientId = patient.id)',
      );
      queryBuilder.select([
        'appointment.id',
        'appointment.startTime',
        'appointment.endTime',
        'appointment.zoomLink',
        'localDoctor.id',
        'localDoctor.firstName',
        'localDoctor.lastName',
        'remoteDoctor.id',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'patient',
        'notes',
      ]);

      return await queryBuilder.getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPatientsByDoctorIdAppointments(
    id: number,
    limit: number = THIRTY,
  ): Promise<Patient[]> {
    try {
      const doctor = await this.doctorService.getDoctorByID(id);

      const appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .leftJoinAndSelect(
          'patient.notes',
          'notes',
          'notes.createdAt = (SELECT MAX(n.createdAt) FROM note n WHERE n.patientId = patient.id)',
        )
        .where(
          'appointment.localDoctorId = :id OR appointment.remoteDoctorId = :id',
          { id: doctor.id },
        )
        .take(limit)
        .getMany();

      const patients: Patient[] = appointments.reduce(
        (uniquePatients: Patient[], appointment) => {
          const existingPatient = uniquePatients.find(
            (patient) => patient.id === appointment.patient.id,
          );
          if (!existingPatient) {
            uniquePatients.push(appointment.patient);
          }
          return uniquePatients;
        },
        [],
      );

      return patients;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getRoomName(id: number, startTime: Date): string {
    const oHeader = { alg: 'HS256', typ: 'JWT' };

    return KJUR.jws.JWS.sign(
      'HS256',
      oHeader,
      JSON.stringify(id),
      JSON.stringify(startTime),
    ).substring(0, 35); // TODO
  }
}
