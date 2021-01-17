import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto';
import { ProductEntity } from './product.entity';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsRepository)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async createProduct(
    { category, cost, name, price, qty, unit }: CreateProductDto,
    userId: number,
  ): Promise<ProductEntity> {
    const product = new ProductEntity();

    product.category = category;
    product.cost = cost;
    product.name = name;
    product.price = price;
    product.qty = qty;
    product.unit = unit;
    product.createdBy = userId;

    return this.productsRepository.save(product);
  }
}
