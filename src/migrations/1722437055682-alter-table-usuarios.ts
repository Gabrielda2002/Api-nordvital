import { MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from "bcrypt";

const saltRounds = 10;

export class AlterTableUsuarios1722437055682 implements MigrationInterface {
    name = 'AlterTableUsuarios1722437055682';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            // Obtener todos los usuarios
            const users = await queryRunner.query('SELECT IdUsuario, CedulaUsuario FROM usuario');
            
            for (const user of users) {
                // Hashear el DNI
                const hashedPassword = await bcrypt.hash(user.CedulaUsuario.toString(), saltRounds);
                
                // Actualizar la contraseña en la base de datos
                await queryRunner.query(
                    'UPDATE usuario SET ClaveUsuario = ? WHERE IdUsuario = ?',
                    [hashedPassword, user.IdUsuario]
                );
            }
        } catch (error) {
            console.error('Error during migration up:', error);
            throw error;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No es posible revertir cambios de contraseñas cifradas
        // Si se requiere revertir en el futuro, se debería implementar una estrategia diferente
    }
}
