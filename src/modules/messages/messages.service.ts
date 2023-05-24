import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import Message from './entities/message.entity';
import DoctorService from '../doctor/doctor.service';
import Doctor from '../doctor/entity/doctor.entity';

@Injectable()
export default class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private doctorService: DoctorService,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const message = await this.messageRepository.save(createMessageDto);

      const messageWithDoctor = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.user', 'user')
        .where('message.id = :id', { id: message.id })
        .getOne();

      return messageWithDoctor;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(clientId: number): Promise<Doctor | null> {
    try {
      const doctor = await this.doctorService.getDoctorByID(clientId);
      return doctor;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
