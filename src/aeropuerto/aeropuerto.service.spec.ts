/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
 let service: AeropuertoService;
 let repository: Repository<AeropuertoEntity>;
 let aeropuertosList: AeropuertoEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [AeropuertoService],
   }).compile();

   service = module.get<AeropuertoService>(AeropuertoService);
   repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
   await seedDatabase();
 });

 const seedDatabase = async () => {
  repository.clear();
  aeropuertosList = [];
  for(let i = 0; i < 5; i++){
      const aeropuerto: AeropuertoEntity = await repository.save({
      nombre: faker.company.name(), 
      codigo: faker.finance.routingNumber(),
      pais: faker.address.country(), 
      ciudad: faker.address.city(), 
      aerolineas: []})
      aeropuertosList.push(aeropuerto);
  }
 }
  
 it('findAll should return all airports', async () => {
  const aeropuerto: AeropuertoEntity[] = await service.findAll();
  expect(aeropuerto).not.toBeNull();
  expect(aeropuerto).toHaveLength(aeropuertosList.length);
 });

 it('findOne should return an airport by id', async () => {
  const storedAirport: AeropuertoEntity = aeropuertosList[0];
  const aeropuerto: AeropuertoEntity = await service.findOne(storedAirport.id);
  expect(aeropuerto).not.toBeNull();
  expect(aeropuerto.nombre).toEqual(storedAirport.nombre)
  expect(aeropuerto.codigo).toEqual(storedAirport.codigo)
  expect(aeropuerto.ciudad).toEqual(storedAirport.ciudad)
  expect(aeropuerto.pais).toEqual(storedAirport.pais)
 });

 it('findOne should throw an exception for an invalid airline', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encuentra el aeropuerto con este id")
 });

 it('create should return a new airport', async () => {
  const airport: AeropuertoEntity = {
    id: "",
    nombre: faker.company.name(),
    codigo: faker.finance.routingNumber(),
    pais: faker.address.country(), 
    ciudad: faker.address.city(),  
    aerolineas: []
  }

  const newAirport: AeropuertoEntity = await service.create(airport);
  expect(newAirport).not.toBeNull();

  const storedAirport: AeropuertoEntity = await repository.findOne({where: {id: newAirport.id}})
  expect(storedAirport).not.toBeNull();
  expect(storedAirport.nombre).toEqual(newAirport.nombre)
  expect(storedAirport.codigo).toEqual(newAirport.codigo)
  expect(storedAirport.ciudad).toEqual(newAirport.ciudad)
  expect(storedAirport.pais).toEqual(newAirport.pais)
 });

 it('update should modify a airport', async () => {
  const airport: AeropuertoEntity = aeropuertosList[0];
  airport.nombre = "New name";
  airport.codigo = "00000-0000-9724293874-234234";
   const updatedAirport: AeropuertoEntity = await service.update(airport.id, airport);
  expect(updatedAirport).not.toBeNull();
   const storedAirport: AeropuertoEntity = await repository.findOne({ where: { id: airport.id } })
  expect(storedAirport).not.toBeNull();
  expect(storedAirport.nombre).toEqual(airport.nombre)
  expect(storedAirport.codigo).toEqual(airport.codigo)
 });

 it('update should throw an exception for an invalid airport', async () => {
  let airport: AeropuertoEntity = aeropuertosList[0];
  airport = {
    ...airport, nombre: "New name", codigo: "00000-0000-9724293874-234234"
  }
  await expect(() => service.update("0", airport)).rejects.toHaveProperty("message", "No se encuentra el aeropuerto con este id")
 });

 it('delete should remove a airport', async () => {
  const airport: AeropuertoEntity = aeropuertosList[0];
  await service.delete(airport.id);
   const deletedAirport: AeropuertoEntity = await repository.findOne({ where: { id: airport.id } })
  expect(deletedAirport).toBeNull();
 });

 it('delete should throw an exception for an invalid airport', async () => {
  const airport: AeropuertoEntity = aeropuertosList[0];
  await service.delete(airport.id);
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encuentra el aeropuerto con este id")
 });

});

