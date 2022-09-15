/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList : AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
          nombre: faker.company.name(), 
          codigo: faker.finance.routingNumber(),
          pais: faker.address.country(), 
          ciudad: faker.address.city(), 
        })
        aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.past(), 
      pagina: faker.internet.url(), 
      aeropuertos: aeropuertosList
    })
  }

  it('addAeropuertoAerolinea should add an airport to an airline', async () => {
    const newAirport: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(), 
      codigo: faker.finance.routingNumber(),
      pais: faker.address.country(), 
      ciudad: faker.address.city(), 
    });

    const newAirline: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.past(), 
      pagina: faker.internet.url()
    })

    const result: AerolineaEntity = await service.addAeropuertoAerolinea(newAirline.id, newAirport.id);
    
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAirport.nombre)
    expect(result.aeropuertos[0].codigo).toBe(newAirport.codigo)
    expect(result.aeropuertos[0].ciudad).toBe(newAirport.ciudad)
    expect(result.aeropuertos[0].pais).toBe(newAirport.pais)
  });

  it('addAeropuertoAerolinea should thrown exception for an invalid airport', async () => {
    const newAirline: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.past(), 
      pagina: faker.internet.url()
    })

    await expect(() => service.addAeropuertoAerolinea(newAirline.id, "0")).rejects.toHaveProperty("message", "No se encuentra el aeropuerto con este id");
  });

  it('addAeropuertoAerolinea should throw an exception for an invalid airline', async () => {
    const newAirport: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(), 
      codigo: faker.finance.routingNumber(),
      pais: faker.address.country(), 
      ciudad: faker.address.city(), 
    });

    await expect(() => service.addAeropuertoAerolinea("0", newAirport.id)).rejects.toHaveProperty("message", "No se encuentra la aerolinea con este id");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should return airport by airline', async () => {
    const airport: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity = await service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, airport.id, )
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(airport.nombre);
    expect(storedAeropuerto.codigo).toBe(airport.codigo);
    expect(storedAeropuerto.ciudad).toBe(airport.ciudad);
    expect(storedAeropuerto.pais).toBe(airport.pais);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an invalid airport', async () => {
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, "0")).rejects.toHaveProperty("message", "No se encuentra el aeropuerto con este id"); 
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0]; 
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId("0", aeropuerto.id)).rejects.toHaveProperty("message", "No se encuentra la aerolinea con este id"); 
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an airport not associated to the airline', async () => {
    const newAirline: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(), 
      codigo: faker.finance.routingNumber(),
      pais: faker.address.country(), 
      ciudad: faker.address.city(), 
    });

    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, newAirline.id)).rejects.toHaveProperty("message", "El aeropuerto con este id no esta asociada a la aerolinea"); 
  });

  it('findAeropuertosByAerolineaId should return airports by airline', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAeropuertosByAerolineaId(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAeropuertosByAerolineaId should throw an exception for an invalid airline', async () => {
    await expect(()=> service.findAeropuertosByAerolineaId("0")).rejects.toHaveProperty("message", "No se encuentra la aerolinea con este id"); 
  });

  it('associateAeropuertosAerolinea should update airports list for a airline', async () => {
    const newAirport: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(), 
      codigo: faker.finance.routingNumber(),
      pais: faker.address.country(), 
      ciudad: faker.address.city(),  
    });

    const updatedAerolinea: AerolineaEntity = await service.associateAeropuertosAerolinea(aerolinea.id, [newAirport]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);

    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAirport.nombre);
    expect(updatedAerolinea.aeropuertos[0].codigo).toBe(newAirport.codigo);
    expect(updatedAerolinea.aeropuertos[0].ciudad).toBe(newAirport.ciudad);
    expect(updatedAerolinea.aeropuertos[0].pais).toBe(newAirport.pais);
  });

  it('associateAeropuertosAerolinea should throw an exception for an invalid airline', async () => {
    const newAirport: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(), 
      codigo: faker.finance.routingNumber(),
      pais: faker.address.country(), 
      ciudad: faker.address.city(), 
    });

    await expect(()=> service.associateAeropuertosAerolinea("0", [newAirport])).rejects.toHaveProperty("message", "No se encuentra la aerolinea con este id"); 
  });

  it('associateAeropuertosAerolinea should throw an exception for an invalid airport', async () => {
    const newAirport: AeropuertoEntity = aeropuertosList[0];
    newAirport.id = "0";

    await expect(()=> service.associateAeropuertosAerolinea(aerolinea.id, [newAirport])).rejects.toHaveProperty("message", "No se encuentra el aeropuerto con este id"); 
  });

  it('deleteAeropuertoToAerolinea should remove an airport from a airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    
    await service.deleteAeropuertoAerolinea(aerolinea.id, aeropuerto.id);

    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const deletedAeropuerto: AeropuertoEntity = storedAerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

    expect(deletedAeropuerto).toBeUndefined();

  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an invalid airport', async () => {
    await expect(()=> service.deleteAeropuertoAerolinea(aerolinea.id, "0")).rejects.toHaveProperty("message", "No se encuentra el aeropuerto con este id"); 
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an invalid airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.deleteAeropuertoAerolinea("0", aeropuerto.id)).rejects.toHaveProperty("message", "No se encuentra la aerolinea con este id"); 
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an non asocciated aeropuerto', async () => {
    const newAirport: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(), 
      codigo: faker.finance.routingNumber(),
      pais: faker.address.country(), 
      ciudad: faker.address.city(), 
    });

    await expect(()=> service.deleteAeropuertoAerolinea(aerolinea.id, newAirport.id)).rejects.toHaveProperty("message", "El aeropuerto con este id no esta asociada a la aerolinea"); 
  });

});