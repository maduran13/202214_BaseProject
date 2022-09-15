/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AerolineaDto {
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
 @Type(() => Date)
 @IsDate()
 @IsNotEmpty()
 readonly fechafundacion: string;
 
 @IsUrl()
 @IsNotEmpty()
 readonly pagina: string;
}
