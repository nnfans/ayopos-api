import { IsNotEmpty } from 'class-validator';
import { ProductUnit } from '../product.interface';

export class CreateProductDto {
  @IsNotEmpty()
  readonly category: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly cost: number;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly qty: number;

  @IsNotEmpty()
  readonly unit: ProductUnit;
}
