/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AeropuertoDto } from './aeropuerto.dto';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly airportService: AeropuertoService) {}

    @Get()
    async findAll() {
      return await this.airportService.findAll();
    }
  
    @Get(':airportId')
    async findOne(@Param('airportId') aeropuertoId: string) {
      return await this.airportService.findOne(aeropuertoId);
    }
  
    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
      const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
      return await this.airportService.create(aeropuerto);
    }
  
    @Put(':airportId')
    async update(@Param('airportId') aeropuertoId: string, @Body() aeropuertoDto: AeropuertoDto) {
      const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
      return await this.airportService.update(aeropuertoId, aeropuerto);
    }
  
    @Delete(':airportId')
    @HttpCode(204)
    async delete(@Param('airportId') aeropuertoId: string) {
      return await this.airportService.delete(aeropuertoId);
    }
}
