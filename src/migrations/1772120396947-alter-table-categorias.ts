import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableCategorias1772120396947 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        // 1. Agregar nuevas columnas a la tabla categorias
        await queryRunner.addColumns('categorias', [
            new TableColumn({
                name: 'descripcion',
                type: 'text',
                isNullable: true
            }),
            new TableColumn({
                name: 'prioridad_id',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'tipo_ticket',
                type: 'enum',
                enum: ['Solicitud', 'Incidente'],
                isNullable: true
            })
        ]);

        // 2. Agregar foreign key para prioridad_id
        await queryRunner.createForeignKey('categorias', new TableForeignKey({
            columnNames: ['prioridad_id'],
            referencedTableName: 'prioridades',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL'
        }));

        // 3. Actualizar las 6 categorías existentes con sus nuevos valores
        // Mapeo: Software → falla de software (Incidente, Alta=3)
        await queryRunner.query(`
            UPDATE categorias 
            SET nombre = 'falla de software (PANA, SAP, PLENUS, THARSIS, ETC)',
                descripcion = 'El sistema no abre, presenta errores, se congela o no permite realizar operaciones habituales.',
                prioridad_id = 3,
                tipo_ticket = 'Incidente'
            WHERE LOWER(nombre) = 'software'
        `);

        // Mapeo: Hardware → falla de computador (Incidente, Media=2)
        await queryRunner.query(`
            UPDATE categorias 
            SET nombre = 'falla de computador',
                descripcion = 'El equipo no enciende, se reinicia solo, va muy lento o muestra pantalla azul.',
                prioridad_id = 2,
                tipo_ticket = 'Incidente'
            WHERE LOWER(nombre) = 'hardware'
        `);

        // Mapeo: Redes → falla de red (Incidente, Alta=3)
        await queryRunner.query(`
            UPDATE categorias 
            SET nombre = 'falla de red (wifi, cable, etc)',
                descripcion = 'Sin conexión a internet, red lenta, wifi no disponible o cable de red dañado.',
                prioridad_id = 3,
                tipo_ticket = 'Incidente'
            WHERE LOWER(nombre) = 'redes'
        `);

        // Mapeo: Administrativo → modificacion de datos (Solicitud, Media=2)
        await queryRunner.query(`
            UPDATE categorias 
            SET nombre = 'modificacion de datos (PANA, SAP, PLENUS, THARSIS, ETC)',
                descripcion = 'Requiere corregir o actualizar información registrada en alguno de los sistemas.',
                prioridad_id = 2,
                tipo_ticket = 'Solicitud'
            WHERE LOWER(nombre) = 'administrativo'
        `);

        // Mapeo: Infraestructura → Adecuación puesto de trabajo (Solicitud, Media=2)
        await queryRunner.query(`
            UPDATE categorias 
            SET nombre = 'Adecuación puesto de trabajo',
                descripcion = 'Solicitar instalación de puntos de red, energía o reubicación de equipos.',
                prioridad_id = 2,
                tipo_ticket = 'Solicitud'
            WHERE LOWER(nombre) = 'infraestructura'
        `);

        // Mapeo: Otros Soportes → Capacitacion (Solicitud, Baja=1)
        await queryRunner.query(`
            UPDATE categorias 
            SET nombre = 'Capacitacion',
                descripcion = 'Solicitar entrenamiento o acompañamiento en el uso de herramientas tecnológicas.',
                prioridad_id = 1,
                tipo_ticket = 'Solicitud'
            WHERE LOWER(nombre) = 'otros soportes' OR LOWER(nombre) = 'otros soporte'
        `);

        // 4. Insertar las 27 categorías restantes

        // INCIDENTES (11 restantes después del mapeo)
        await queryRunner.query(`
            INSERT INTO categorias (nombre, descripcion, prioridad_id, tipo_ticket)
            VALUES 
            ('falla de impresora y/o escáner', 'La impresora o escáner no imprime, no escanea, presenta atascos o no es detectada por el equipo.', 2, 'Incidente'),
            ('falla de celular', 'El celular corporativo no enciende, no carga, presenta fallas en pantalla o aplicaciones.', 2, 'Incidente'),
            ('falla de periférico (teclado, mouse, etc)', 'El teclado, mouse u otro accesorio no responde, funciona intermitente o está dañado.', 1, 'Incidente'),
            ('falla de correo electrónico', 'No puede enviar ni recibir correos, el buzón está lleno o presenta errores de acceso.', 2, 'Incidente'),
            ('Generacion de copia de seguridad (mover informacion a nuevo equipo)', 'Necesita respaldar archivos o trasladar información de un equipo a otro.', 2, 'Incidente'),
            ('Falla de digiturno', 'El sistema de turnos no funciona, no asigna turnos o la pantalla no muestra información.', 2, 'Incidente'),
            ('Falla de televisor', 'El televisor no enciende, no muestra imagen, sin señal o presenta fallas de audio.', 1, 'Incidente'),
            ('Falla de UPS', 'La UPS emite alarma, no carga la batería o no protege los equipos ante cortes de energía.', 3, 'Incidente'),
            ('Falla de camara de seguridad', 'La cámara no graba, no se visualiza en el monitor o presenta imagen distorsionada.', 3, 'Incidente')
        `);

        // SOLICITUDES (18 restantes después del mapeo)
        await queryRunner.query(`
            INSERT INTO categorias (nombre, descripcion, prioridad_id, tipo_ticket)
            VALUES 
            ('restablecer contraseña', 'Olvidó o necesita cambiar su contraseña de acceso a sistemas o correo corporativo.', 3, 'Solicitud'),
            ('Parametrización de servicios (PANA, SAP, PLENUS, ETC)', 'Configurar, agregar o modificar servicios, tarifas o parámetros en los sistemas.', 2, 'Solicitud'),
            ('intalación de impresora y/o escáner', 'Necesita que se instale o configure una impresora o escáner en su equipo de trabajo.', 2, 'Solicitud'),
            ('Entrega o reasignación de equipo', 'Solicitar un equipo nuevo, de reemplazo o reasignar uno existente a otro usuario.', 2, 'Solicitud'),
            ('Creacion de VPN', 'Requiere acceso remoto seguro a la red corporativa desde fuera de la oficina.', 3, 'Solicitud'),
            ('Creacion de correo electrónico', 'Solicitar una nueva cuenta de correo electrónico corporativo para un colaborador.', 2, 'Solicitud'),
            ('Creacion de usuario (PANA, SAP, PLENUS, THARSIS, ETC)', 'Crear una cuenta de usuario nueva en los sistemas para un colaborador.', 3, 'Solicitud'),
            ('Inactivar de usuario (PANA, SAP, PLENUS, THARSIS, ETC)', 'Desactivar el acceso de un usuario en los sistemas por retiro o cambio de cargo.', 3, 'Solicitud'),
            ('Generacion de informes', 'Solicitar la extracción de reportes o datos específicos desde los sistemas.', 2, 'Solicitud'),
            ('Asignación de tinta', 'Solicitar cartuchos o recargas de tinta para impresoras de inyección.', 3, 'Solicitud'),
            ('Solicitud de compra de equipo', 'Requiere la adquisición de un equipo nuevo (PC, portátil, monitor, etc.).', 1, 'Solicitud'),
            ('Solicitud de toner', 'Solicitar tóner de reemplazo para impresoras láser.', 3, 'Solicitud'),
            ('Solicitud de desarrollo de software', 'Requiere una nueva funcionalidad, módulo o aplicación desarrollada a medida.', 2, 'Solicitud'),
            ('Solicitud de instalación de software', 'Necesita que se instale un programa o aplicación en su equipo de trabajo.', 1, 'Solicitud'),
            ('Asignación de permisos en sistemas (PANA, SAP, PLENUS, THARSIS, ETC)', 'Solicitar acceso a módulos, funciones o roles adicionales en los sistemas.', 2, 'Solicitud'),
            ('Solicitud de acceso de información (Carpetas compartidas, etc)', 'Requiere acceso a carpetas compartidas, unidades de red o recursos de información.', 2, 'Solicitud'),
            ('Instalación de camara de seguridad', 'Solicitar la instalación o reubicación de cámaras de vigilancia en una sede.', 2, 'Solicitud'),
            ('Mantenimiento de impresora', 'Solicitar limpieza, revisión preventiva o correctiva de una impresora.', 2, 'Solicitud')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las categorías agregadas (mantener las 6 originales con sus nombres originales)
        await queryRunner.query(`
            DELETE FROM categorias 
            WHERE nombre IN (
                'falla de impresora y/o escáner',
                'falla de celular',
                'falla de periférico (teclado, mouse, etc)',
                'falla de correo electrónico',
                'Generacion de copia de seguridad (mover informacion a nuevo equipo)',
                'Falla de digiturno',
                'Falla de televisor',
                'Falla de UPS',
                'Falla de camara de seguridad',
                'restablecer contraseña',
                'Parametrización de servicios (PANA, SAP, PLENUS, ETC)',
                'intalación de impresora y/o escáner',
                'Entrega o reasignación de equipo',
                'Creacion de VPN',
                'Creacion de correo electrónico',
                'Creacion de usuario (PANA, SAP, PLENUS, THARSIS, ETC)',
                'Inactivar de usuario (PANA, SAP, PLENUS, THARSIS, ETC)',
                'Generacion de informes',
                'Asignación de tinta',
                'Solicitud de compra de equipo',
                'Solicitud de toner',
                'Solicitud de desarrollo de software',
                'Solicitud de instalación de software',
                'Asignación de permisos en sistemas (PANA, SAP, PLENUS, THARSIS, ETC)',
                'Solicitud de acceso de información (Carpetas compartidas, etc)',
                'Instalación de camara de seguridad',
                'Mantenimiento de impresora'
            )
        `);

        // Restaurar nombres originales de las 6 categorías mapeadas
        await queryRunner.query(`
            UPDATE categorias SET nombre = 'Software' WHERE nombre = 'falla de software (PANA, SAP, PLENUS, THARSIS, ETC)';
            UPDATE categorias SET nombre = 'Hardware' WHERE nombre = 'falla de computador';
            UPDATE categorias SET nombre = 'Redes' WHERE nombre = 'falla de red (wifi, cable, etc)';
            UPDATE categorias SET nombre = 'Administrativo' WHERE nombre = 'modificacion de datos (PANA, SAP, PLENUS, THARSIS, ETC)';
            UPDATE categorias SET nombre = 'Infraestructura' WHERE nombre = 'Adecuación puesto de trabajo';
            UPDATE categorias SET nombre = 'Otros Soportes' WHERE nombre = 'Capacitacion';
        `);

        // Eliminar foreign key
        const table = await queryRunner.getTable('categorias');
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('prioridad_id') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('categorias', foreignKey);
        }

        // Eliminar columnas
        await queryRunner.dropColumn('categorias', 'tipo_ticket');
        await queryRunner.dropColumn('categorias', 'prioridad_id');
        await queryRunner.dropColumn('categorias', 'descripcion');
    }
}
