import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const productsSeeds = [
  {
    id: 1,
    title: 'Tesla Model Y 2023',
    price: 60000,
    currency: 'USD',
    inStock: true,
  },
  {
    id: 2,
    title: 'IPhone 13 2023 128GB',
    price: 1500,
    currency: 'USD',
    inStock: true,
  },
  {
    id: 3,
    title: 'Sony PlayStation 5',
    price: 3000,
    currency: 'USD',
    inStock: true,
  },
];

export class InitCommandSchema1698749226055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'real',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'inStock',
            type: 'boolean',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.query(`INSERT INTO "products" ("title", "price", "currency", "inStock")
    VALUES ${productsSeeds
      .map((product) => `('${product.title}', ${product.price}, '${product.currency}', ${product.inStock})`)
      .join(',')}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
