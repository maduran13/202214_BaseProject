/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Module({
  providers: [AerolineaAeropuertoService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
})
export class AerolineaAeropuertoModule {}
