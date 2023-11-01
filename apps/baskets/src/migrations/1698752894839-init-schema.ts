import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class InitSchema1698752894839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'baskets',
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
            name: 'userId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'totalPrice',
            type: 'real',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'basket_products',
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
            name: 'productsPrice',
            type: 'real',
            isNullable: false,
          },
          {
            name: 'productQuantity',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'productId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'productTitle',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'basket_products',
      new TableColumn({
        name: 'basketId',
        type: 'integer',
      }),
    );

    await queryRunner.createForeignKey(
      'basket_products',
      new TableForeignKey({
        columnNames: ['basketId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'baskets',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('basket_products');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('basketId') !== -1);

    await queryRunner.dropForeignKey('basket_products', foreignKey);
    await queryRunner.dropColumn('basket_products', 'basketId');

    await queryRunner.dropTable('basket_products');
    await queryRunner.dropTable('baskets');
  }
}
