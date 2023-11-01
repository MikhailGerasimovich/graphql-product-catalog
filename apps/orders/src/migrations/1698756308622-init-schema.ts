import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class InitSchema1698756308622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
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
            name: 'totalSpendMoney',
            type: 'real',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'order_products',
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
            name: 'productId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'productQuantity',
            type: 'integer',
            isNullable: false,
          },

          {
            name: 'purchaseDate',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'order_products',
      new TableColumn({
        name: 'orderId',
        type: 'integer',
      }),
    );

    await queryRunner.createForeignKey(
      'order_products',
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_products');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('orderId') !== -1);

    await queryRunner.dropForeignKey('order_products', foreignKey);
    await queryRunner.dropColumn('order_products', 'orderId');

    await queryRunner.dropTable('order_products');
    await queryRunner.dropTable('orders');
  }
}
