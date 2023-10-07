import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { likeFilter } from '@app/common';

import { Product } from './entities';
import { CreateProductInput, FindProductInput, UpdateProductInput } from './dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(findProductInput: FindProductInput): Promise<Product[]> {
    const findEntity = this.productRepo.create(findProductInput);
    const products = await this.productRepo.find({
      where: {
        ...likeFilter(findEntity),
      },
    });

    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    return product;
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const productEntity = this.productRepo.create(createProductInput);
    const savedProduct = await this.productRepo.save(productEntity);
    return savedProduct;
  }

  async update(id: number, updateProductInput: UpdateProductInput): Promise<Product> {
    const existingProduct = await this.findOne(id);
    const productEntity = this.productRepo.create(updateProductInput);

    const updatedProduct = await this.productRepo.save({
      ...existingProduct,
      ...productEntity,
    });
    return updatedProduct;
  }

  async delete(id: number): Promise<boolean> {
    const data = await this.productRepo.delete(id);
    return data && data.affected > 0;
  }
}
