/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
 let service: AerolineaService;
 let repository: Repository<AerolineaEntity>;
 let aerolineasList: AerolineaEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [AerolineaService],
   }).compile();

   service = module.get<AerolineaService>(AerolineaService);
   repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
   await seedDatabase();
 });

 const seedDatabase = async () => {
  repository.clear();
  aerolineasList = [];
  for(let i = 0; i < 5; i++){
      const aerolinea: AerolineaEntity = await repository.save({
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.past(), 
      pagina: faker.internet.url(), 
      aeropuertos: []})
      aerolineasList.push(aerolinea);
  }
 }
  
 it('findAll should return all aerolineas', async () => {
  const aerolineas: AerolineaEntity[] = await service.findAll();
  expect(aerolineas).not.toBeNull();
  expect(aerolineas).toHaveLength(aerolineasList.length);
 });

 it('findOne should return a aerolinea by id', async () => {
  const storedAirline: AerolineaEntity = aerolineasList[0];
  const aerolinea: AerolineaEntity = await service.findOne(storedAirline.id);
  expect(aerolinea).not.toBeNull();
  expect(aerolinea.nombre).toEqual(storedAirline.nombre)
  expect(aerolinea.descripcion).toEqual(storedAirline.descripcion)
  expect(aerolinea.fechafundacion).toEqual(storedAirline.fechafundacion)
  expect(aerolinea.pagina).toEqual(storedAirline.pagina)
 });

 it('findOne should throw an exception for an invalid airline', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encuentra la aerolinea con este id")
 });

 it('create should return a new airline', async () => {
  const airline: AerolineaEntity = {
    id: "",
    nombre: faker.company.name(),
    descripcion: faker.lorem.sentence(),
    fechafundacion: faker.date.past(),
    pagina: faker.internet.url(), 
    aeropuertos: []
  }

  const newAirline: AerolineaEntity = await service.create(airline);
  expect(newAirline).not.toBeNull();

  const storedAirline: AerolineaEntity = await repository.findOne({where: {id: newAirline.id}})
  expect(storedAirline).not.toBeNull();
  expect(storedAirline.nombre).toEqual(newAirline.nombre)
  expect(storedAirline.descripcion).toEqual(newAirline.descripcion)
  expect(storedAirline.fechafundacion).toEqual(newAirline.fechafundacion)
  expect(storedAirline.pagina).toEqual(newAirline.pagina)
 });

 it('update should modify a airline', async () => {
  const airline: AerolineaEntity = aerolineasList[0];
  airline.nombre = "New name";
  airline.pagina = "http://airline.corp.co";
   const updatedAirline: AerolineaEntity = await service.update(airline.id, airline);
  expect(updatedAirline).not.toBeNull();
   const storedAirline: AerolineaEntity = await repository.findOne({ where: { id: airline.id } })
  expect(storedAirline).not.toBeNull();
  expect(storedAirline.nombre).toEqual(airline.nombre)
  expect(storedAirline.pagina).toEqual(airline.pagina)
 });

 it('update should throw an exception for an invalid airline', async () => {
  let airline: AerolineaEntity = aerolineasList[0];
  airline = {
    ...airline, nombre: "New name", pagina: "http://airline.corp.co"
  }
  await expect(() => service.update("0", airline)).rejects.toHaveProperty("message", "No se encuentra la aerolinea con este id")
 });

 it('delete should remove a airline', async () => {
  const airline: AerolineaEntity = aerolineasList[0];
  await service.delete(airline.id);
   const deletedAirline: AerolineaEntity = await repository.findOne({ where: { id: airline.id } })
  expect(deletedAirline).toBeNull();
 });

 it('delete should throw an exception for an invalid airline', async () => {
  const airline: AerolineaEntity = aerolineasList[0];
  await service.delete(airline.id);
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encuentra la aerolinea con este id")
 });
});

