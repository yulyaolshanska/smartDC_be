import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './entity/doctor.entity';

@Controller('doctor')
export class DoctorController {
    constructor(private readonly doctorService: DoctorService){}

    @Post()
    async createBook(@Res() response, @Body()doctor: Doctor) {
        const newDoctor = await this.doctorService.createDoctor(doctor);
        return response.status(HttpStatus.CREATED).json({
            newDoctor
        })
    }

    @Get()
    async fetchAll(@Res() response) {
        const doctors = await this.doctorService.findAll();
        return response.status(HttpStatus.OK).json({
            doctors
        })
    }

    @Get('/:id')
    async findById(@Res() response, @Param('id') id) {
        const doctor = await this.doctorService.findOne(id);
        return response.status(HttpStatus.OK).json({
            doctor
        })
    }
}
