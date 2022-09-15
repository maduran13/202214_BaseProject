/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaService } from './aerolinea.service';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly airlineService: AerolineaService) {}

    @Get()
    async findAll() {
      return await this.airlineService.findAll();
    }
  
    @Get(':airlineId')
    async findOne(@Param('airlineId') aerolineaId: string) {
      return await this.airlineService.findOne(aerolineaId);
    }
  
    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
      const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.airlineService.create(aerolinea);
    }
  
    @Put(':airlineId')
    async update(@Param('airlineId') aerolineaId: string, @Body() aerolineaDto: AerolineaDto) {
      const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.airlineService.update(aerolineaId, aerolinea);
    }
  
    @Delete(':airlineId')
    @HttpCode(204)
    async delete(@Param('airlineId') aerolineaId: string) {
      return await this.airlineService.delete(aerolineaId);
    }
}
