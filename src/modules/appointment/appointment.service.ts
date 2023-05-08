import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import DoctorService from 'modules/doctor/doctor.service';
import PatientService from 'modules/patient/patient.service';
import Patient from 'modules/patient/entity/patient.entity';
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

      const [patient, localDoctor, remoteDoctor] = await Promise.all([
        this.patientService.getPatientById(patientId),
        this.doctorService.getDoctorByID(localDoctorId),
        this.doctorService.getDoctorByID(remoteDoctorId),
      ]);

      const newAppointment = this.appointmentRepository.create({
        localDoctor,
        remoteDoctor,
        patient,
        ...rest,
      });

      const savedAppointment = await this.appointmentRepository.save(newAppointment);

      return { ...savedAppointment, id: savedAppointment.id };
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // TODO: can be used for getting appointments for today, week and month
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

  // TODO: can be used for getting appointments for today, week and month
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

  async getPatientsByDoctorIdAppointments(id: number): Promise<Patient[]> {
    try {
      const doctor = await this.doctorService.getDoctorByID(id);

      const appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .where(
          'appointment.localDoctorId = :id OR appointment.remoteDoctorId = :id',
          { id: doctor.id },
        )
        .getMany();

      const patients: Patient[] = appointments.reduce((uniquePatients: Patient[], appointment) => {
        const existingPatient = uniquePatients.find(patient => patient.id === appointment.patient.id);
        if (!existingPatient) {
          uniquePatients.push(appointment.patient);
        }
        return uniquePatients;
      }, []);
        
      return patients;        
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
