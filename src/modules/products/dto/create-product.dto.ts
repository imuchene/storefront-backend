import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends PartialType(Product) {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsNumber()
  @IsNotEmpty()
  unitPrice?: number;

  @IsString()
  @IsNotEmpty()
  description?: string;
}
