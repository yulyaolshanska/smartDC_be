import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DoctorService from 'modules/doctor/doctor.service';
import PatientService from 'modules/patient/patient.service';
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
    const { localDoctorId, remoteDoctorId, patientId, ...rest } =
      createAppointmentDto;

    const localDoctor = await this.doctorService.getDoctorByID(localDoctorId);
    const remoteDoctor = await this.doctorService.getDoctorByID(remoteDoctorId);
    const patient = await this.patientService.getPatientById(patientId);

    const appointment = this.appointmentRepository.create({
      localDoctor,
      remoteDoctor,
      patient,
      ...rest,
    });

    return this.appointmentRepository.save(appointment);
  }
}
