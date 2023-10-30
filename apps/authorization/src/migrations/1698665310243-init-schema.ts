import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class InitSchema1698665310243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            name: 'username',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'passwordSalt',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'tokens',
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
            name: 'refreshToken',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'expirationDate',
            type: 'timestamp',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'tokens',
      new TableColumn({
        name: 'userId',
        type: 'integer',
      }),
    );

    await queryRunner.createForeignKey(
      'tokens',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tokens');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);

    await queryRunner.dropForeignKey('tokens', foreignKey);
    await queryRunner.dropColumn('tokens', 'userId');

    await queryRunner.dropTable('tokens');
    await queryRunner.dropTable('users');
  }
}
