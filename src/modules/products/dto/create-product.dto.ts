import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends PartialType(Product) {
  @IsString()
  name?: string;

  @IsNumber()
  unitPrice?: number;

  @IsString()
  description?: string;
}
