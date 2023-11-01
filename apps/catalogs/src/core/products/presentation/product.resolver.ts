import { Args, Mutation, Query, ResolveReference, Resolver } from '@nestjs/graphql';
import { ParseIntPipe, UseGuards } from '@nestjs/common';

import { JwtAuthGuard, RedisService, Role, Roles, RolesGuard } from '@app/common';

import { CreateProductInput, FindProductInput, ProductService, UpdateProductInput } from '../application';
import { getProductCacheKey } from '../../../common';
import { Product } from '../domain';

@UseGuards(JwtAuthGuard)
@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly cache: RedisService,
  ) {}

  @Query(() => [Product], { nullable: true })
  async findAllProducts(@Args('input', { nullable: true }) findProductInput: FindProductInput) {
    const key = getProductCacheKey();
    const fromCache = await this.cache.get(key);
    if (fromCache) {
      return fromCache;
    }

    const products = await this.productService.findAll(findProductInput);
    await this.cache.set(key, products);
    return products;
  }

  @Query(() => Product, { nullable: true })
  async findOneProduct(@Args('id', ParseIntPipe) id: number) {
    const key = getProductCacheKey(id);
    const fromCache = await this.cache.get(getProductCacheKey(id));
    if (fromCache) {
      return fromCache;
    }

    const product = await this.productService.findOne(id);
    await this.cache.set(key, product);
    return product;
  }

  @Roles(Role.MANAGER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Product)
  async createProduct(@Args('input') createProductInput: CreateProductInput) {
    await this.cache.del(getProductCacheKey());
    const product = await this.productService.create(createProductInput);
    return product;
  }

  @Roles(Role.MANAGER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('id', ParseIntPipe) id: number,
    @Args('input') updateProductInput: UpdateProductInput,
  ) {
    await this.cache.del(getProductCacheKey());
    await this.cache.del(getProductCacheKey(id));
    const product = await this.productService.update(id, updateProductInput);
    return product;
  }

  @Roles(Role.MANAGER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Boolean, { nullable: true })
  async deleteProduct(@Args('id', ParseIntPipe) id: number) {
    await this.cache.del(getProductCacheKey());
    await this.cache.del(getProductCacheKey(id));
    return await this.productService.delete(id);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: number }): Promise<Product> {
    return await this.productService.findOne(reference.id);
  }
}
