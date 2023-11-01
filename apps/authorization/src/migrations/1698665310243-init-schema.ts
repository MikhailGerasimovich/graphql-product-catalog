import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, getRepository } from 'typeorm';

const usersSeeds = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@mail.ru',
    password: '$2b$10$.bCSXs1DDjvy4C5BEZ3jZuQpsIFuBixREx607QNLNFpM7BBqswore',
    passwordSalt: '$2b$10$.bCSXs1DDjvy4C5BEZ3jZu',
    role: 'ADMIN',
  },
  {
    id: 2,
    username: 'manager',
    email: 'manager@mail.ru',
    password: '$2b$10$IXhEBNxCDy.t9q8yGMe/qO0tq0PwKmsnWIuJwvK9sYGULBx6vp.E.',
    passwordSalt: '$2b$10$IXhEBNxCDy.t9q8yGMe/qO',
    role: 'MANAGER',
  },
  {
    id: 3,
    username: 'user',
    email: 'user@mail.ru',
    password: '$2b$10$UgCpQj7RFEl0xCN2rn8Vf.eLBrMiJezPv0DuF1t2i3XDgqGKlZo2m',
    passwordSalt: '$2b$10$UgCpQj7RFEl0xCN2rn8Vf.',
    role: 'USER',
  },
];

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

    await queryRunner.query(`INSERT INTO "users" ("username", "email", "password", "passwordSalt", "role")
      VALUES ${usersSeeds
        .map(
          (user) =>
            `('${user.username}', '${user.email}', '${user.password}', '${user.passwordSalt}', '${user.role}')`,
        )
        .join(',')}`);
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
