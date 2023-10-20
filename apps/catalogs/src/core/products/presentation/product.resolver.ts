import { Args, Mutation, Query, ResolveReference, Resolver } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';

import { Product } from '../domain';
import { CreateProductInput, FindProductInput, ProductService, UpdateProductInput } from '../application';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async findAllProducts(@Args('input', { nullable: true }) findProductInput: FindProductInput) {
    const products = await this.productService.findAll(findProductInput);
    return products;
  }

  @Query(() => Product)
  async findOneProduct(@Args('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);
    return product;
  }

  @Mutation(() => Product)
  async createProduct(@Args('input') createProductInput: CreateProductInput) {
    const product = await this.productService.create(createProductInput);
    return product;
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', ParseIntPipe) id: number,
    @Args('input') updateProductInput: UpdateProductInput,
  ) {
    const product = await this.productService.update(id, updateProductInput);
    return product;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id', ParseIntPipe) id: number) {
    return await this.productService.delete(id);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: number }): Promise<Product> {
    return await this.productService.findOne(reference.id);
  }
}