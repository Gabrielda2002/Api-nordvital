import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateTablePushSubscriptions1741192036374 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'push_subscriptions',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'subscription',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['user_id'],
                        referencedColumnNames: ['IdUsuario'],
                        referencedTableName: 'usuario',
                        onDelete: 'CASCADE',
                    }),
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('push_subscriptions');
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('user_id') !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey('push_subscriptions', foreignKey);
            
            await queryRunner.dropIndex('push_subscriptions', 'IDX_PUSH_SUBSCRIPTIONS_USER_ID');
            await queryRunner.dropTable('push_subscriptions');
        }
    }
}