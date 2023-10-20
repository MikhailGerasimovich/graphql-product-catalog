import { Injectable } from '@nestjs/common';

import { CreateProductInput, FindProductInput, UpdateProductInput } from '../dto';
import { Product } from '../../domain';

@Injectable()
export class ProductService {
  constructor() {}

  async findAll(findProductInput: FindProductInput): Promise<Product[]> {
    return null;
  }

  async findOne(id: number): Promise<Product> {
    return null;
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    return null;
  }

  async update(id: number, updateProductInput: UpdateProductInput): Promise<Product> {
    return null;
  }

  async delete(id: number): Promise<boolean> {
    return null;
  }
}
