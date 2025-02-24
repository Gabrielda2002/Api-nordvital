export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Nordvitalips API",
            version: "1.0.0",
            description: "API para la aplicación intranet de Nordvitalips",
        },
        servers:[
            {
                url: "http://localhost:3600/api/v1",
                description: "Development server Back End"
            },
            {
                url: "http://localhost:5173",
                description: "Development server Front End"
            },
            {
                url: "https://test.nordvitalips.com",
                description: "Test server Front End"
            },
            {
                url: "api.nordvitalips.com",
                description: "Production server Back End"
            },
            {
                url: "https://app.nordvitalips.com",
                description: "Production server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                IpsRemite: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID de la IPS Remite'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre de la IPS Remite'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado de la IPS Remite'
                        }
                    }
                },
                LugarRadicacion: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del lugar de radicación'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del lugar de radicación'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del lugar de radicación'
                        },
                        address: {
                            type: 'string',
                            description: 'Dirección del lugar de radicación'
                        },
                        departamento: {
                            type: 'integer',
                            description: 'ID del departamento'
                        },
                        city: {
                            type: 'integer',
                            description: 'ID de la ciudad'
                        }
                    }
                },
                Municipio: {
                    type: 'object',
                    required: ['name', 'nitMunicipio'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del municipio'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del municipio'
                        },
                        municipioCode: {
                            type: 'integer',
                            description: 'Código del municipio'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del municipio'
                        }
                    }
                },
                Paciente: {
                    type: 'object',
                    required: ['documentType', 'documentNumber', 'name', 'phoneNumber', 'convenio', 'ipsPrimaria'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del paciente'
                        },
                        documentType: {
                            type: 'integer',
                            description: 'Tipo de documento'
                        },
                        documentNumber: {
                            type: 'integer',
                            description: 'Número de documento'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre completo del paciente'
                        },
                        phoneNumber: {
                            type: 'string',
                            description: 'Número de teléfono principal'
                        },
                        phoneNumber2: {
                            type: 'string',
                            description: 'Número de teléfono secundario',
                            nullable: true
                        },
                        landline: {
                            type: 'string',
                            description: 'Teléfono fijo'
                        },
                        email: {
                            type: 'string',
                            description: 'Correo electrónico'
                        },
                        address: {
                            type: 'string',
                            description: 'Dirección'
                        },
                        convenio: {
                            type: 'integer',
                            description: 'ID del convenio'
                        },
                        ipsPrimaria: {
                            type: 'integer',
                            description: 'ID de la IPS primaria'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del paciente'
                        }
                    }
                },
                Radicacion: {
                    type: 'object',
                    required: ['orderDate', 'place', 'ipsRemitente', 'profetional', 'specialty', 'groupServices', 'typeServices', 'idPatient'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID de la radicación'
                        },
                        orderDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de la orden'
                        },
                        place: {
                            type: 'integer',
                            description: 'ID del lugar de radicación'
                        },
                        ipsRemitente: {
                            type: 'integer',
                            description: 'ID de la IPS remitente'
                        },
                        profetional: {
                            type: 'string',
                            description: 'Nombre del profesional'
                        },
                        specialty: {
                            type: 'integer',
                            description: 'ID de la especialidad'
                        },
                        groupServices: {
                            type: 'integer',
                            description: 'ID del grupo de servicios'
                        },
                        typeServices: {
                            type: 'integer',
                            description: 'ID del tipo de servicio'
                        },
                        radicador: {
                            type: 'integer',
                            description: 'ID del usuario que radica'
                        },
                        auditora: {
                            type: 'string',
                            description: 'Nombre de la auditora'
                        },
                        auditDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de auditoría'
                        },
                        justify: {
                            type: 'string',
                            description: 'Justificación'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado de la radicación'
                        }
                    }
                },
                Radicador: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del radicador'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del radicador'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del radicador'
                        }
                    }
                },
                ReportExcelFilter: {
                    type: 'object',
                    properties: {
                        auditDateStart: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha inicial de auditoría'
                        },
                        auditDateEnd: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha final de auditoría'
                        },
                        dateStart: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha inicial de radicado'
                        },
                        dateEnd: {
                            type: 'string',
                            format: 'date', 
                            description: 'Fecha final de radicado'
                        },
                        cupsCode: {
                            type: 'string',
                            description: 'Código CUPS a filtrar'
                        }
                    }
                },
                CirugiasFiltro: {
                    type: 'object',
                    required: ['dateStart', 'dateEnd'],
                    properties: {
                        dateStart: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha inicial de ordenamiento'
                        },
                        dateEnd: {
                            type: 'string', 
                            format: 'date',
                            description: 'Fecha final de ordenamiento'
                        }
                    }
                },
                SeguimientoDispositivosRed: {
                    type: 'object',
                    required: ['deviceId', 'eventType', 'dateEvent', 'description', 'responsible'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del seguimiento'
                        },
                        deviceId: {
                            type: 'integer',
                            description: 'ID del dispositivo de red'
                        },
                        eventType: {
                            type: 'string',
                            description: 'Tipo de evento'
                        },
                        dateEvent: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha del evento'
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción del evento'
                        },
                        responsible: {
                            type: 'integer',
                            description: 'ID del responsable'
                        }
                    }
                },
                SeguimientoAuxiliarCirugias: {
                    type: 'object',
                    required: ['observation', 'status', 'surgeryId'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del seguimiento auxiliar de cirugía'
                        },
                        observation: {
                            type: 'string',
                            description: 'Observaciones del seguimiento'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del seguimiento'
                        },
                        cupsId: {
                            type: 'integer',
                            description: 'ID del CUPS asociado'
                        },
                        surgeryId: {
                            type: 'integer',
                            description: 'ID de la cirugía asociada'
                        }
                    }
                },
                Servicio: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del servicio'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del servicio'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del servicio'
                        }
                    }
                },
                ServicioSolicitado: {
                    type: 'object',
                    required: ['code', 'name'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del servicio solicitado'
                        },
                        code: {
                            type: 'string',
                            description: 'Código del servicio solicitado'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del servicio solicitado'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del servicio solicitado'
                        }
                    }
                },
                Software: {
                    type: 'object',
                    required: ['name', 'equipmentId', 'versions', 'license', 'installDate'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del software'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del software'
                        },
                        equipmentId: {
                            type: 'integer',
                            description: 'ID del equipo al que pertenece'
                        },
                        versions: {
                            type: 'string',
                            description: 'Versión del software'
                        },
                        license: {
                            type: 'string',
                            description: 'Licencia del software'
                        },
                        otherData: {
                            type: 'string',
                            description: 'Datos adicionales',
                            nullable: true
                        },
                        installDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de instalación'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del software'
                        }
                    }
                },
                Soporte: {
                    type: 'object',
                    required: ['name', 'url', 'size', 'type', 'nameSaved'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del soporte'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre original del archivo'
                        },
                        url: {
                            type: 'string',
                            description: 'Ruta del archivo en el servidor'
                        },
                        size: {
                            type: 'integer',
                            description: 'Tamaño del archivo en bytes'
                        },
                        type: {
                            type: 'string',
                            description: 'Tipo MIME del archivo'
                        },
                        nameSaved: {
                            type: 'string',
                            description: 'Nombre con el que se guardó el archivo en el servidor'
                        }
                    }
                },
                UnidadFuncional: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID de la unidad funcional'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre de la unidad funcional'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado de la unidad funcional'
                        }
                    }
                },
                Usuario: {
                    type: 'object',
                    required: ['dniNumber', 'name', 'lastName', 'dniType', 'email', 'password', 'municipio', 'rol'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del usuario'
                        },
                        dniNumber: {
                            type: 'integer',
                            description: 'Número de documento'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del usuario'
                        },
                        lastName: {
                            type: 'string',
                            description: 'Apellido del usuario'
                        },
                        dniType: {
                            type: 'integer',
                            description: 'Tipo de documento'
                        },
                        email: {
                            type: 'string',
                            description: 'Correo electrónico'
                        },
                        password: {
                            type: 'string',
                            description: 'Contraseña del usuario'
                        },
                        photo: {
                            type: 'string',
                            description: 'Ruta de la foto de perfil'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del usuario'
                        },
                        municipio: {
                            type: 'integer',
                            description: 'ID del municipio'
                        },
                        rol: {
                            type: 'integer',
                            description: 'ID del rol'
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de creación'
                        },
                        area: {
                            type: 'string',
                            description: 'Área de trabajo'
                        },
                        cargo: {
                            type: 'string',
                            description: 'Cargo del usuario'
                        },
                        phoneNumber: {
                            type: 'integer',
                            description: 'Número de teléfono'
                        },
                        headquarters:{
                            type: 'integer',
                            description: 'ID de la sede del usuario'
                        }

                    }
                },
                PausasActivas: {
                    type: 'object',
                    required: ['observation', 'userId'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID de la pausa activa'
                        },
                        observation: {
                            type: 'string',
                            description: 'Observación de la pausa activa'
                        },
                        userId: {
                            type: 'integer',
                            description: 'ID del usuario que registra la pausa'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación'
                        }
                    }
                },
                Evento: {
                    type: 'object',
                    required: ['title', 'dateStart', 'dateEnd', 'color'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del evento'
                        },
                        title: {
                            type: 'string',
                            description: 'Título del evento'
                        },
                        dateStart: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de inicio del evento'
                        },
                        dateEnd: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de fin del evento'
                        },
                        color: {
                            type: 'string',
                            description: 'Color del evento en formato hexadecimal'
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción del evento'
                        }
                    }
                },
                NotaTecnica: {
                    type: 'object',
                    required: ['idEps', 'idService', 'frecuencyUse', 'amount', 'subgroup', 'group', 'idSede', 'rate'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID de la nota técnica'
                        },
                        idEps: {
                            type: 'integer',
                            description: 'ID de la EPS'
                        },
                        idService: {
                            type: 'integer',
                            description: 'ID del servicio'
                        },
                        frecuencyUse: {
                            type: 'string',
                            description: 'Frecuencia de uso'
                        },
                        amount: {
                            type: 'integer',
                            description: 'Cantidad'
                        },
                        subgroup: {
                            type: 'string',
                            description: 'Subgrupo del servicio'
                        },
                        group: {
                            type: 'string',
                            description: 'Grupo del servicio'
                        },
                        idSede: {
                            type: 'integer',
                            description: 'ID de la sede'
                        },
                        rate: {
                            type: 'integer',
                            description: 'Tarifa'
                        },
                        idTypeService: {
                            type: 'integer',
                            description: 'ID del tipo de servicio'
                        },
                        nameContract: {
                            type: 'string',
                            desceription: 'Nombre del contrato'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de actualización'
                        }
                    }
                },
                ServiciosGenerales: {
                    type: 'object',
                    required: ['code', 'description'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del servicio general'
                        },
                        code: {
                            type: 'string',
                            description: 'Código del servicio general'
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción del servicio general'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de actualización'
                        }
                    }
                },
                ServiciosEjecutados: {
                    type: 'object',
                    required: [
                        'idSede',
                        'idService',
                        'amount',
                        'rate',
                        'statusService',
                        'subGroup',
                        'documentType',
                        'identification',
                        'patientName',
                        'patientSex',
                        'dateBirth',
                        'riasGroup',
                        'mainDx',
                        'medicoCode',
                        'medicoName',
                        'medicoSpc',
                        'nameContract',
                        'userRegimen',
                        'authorizationNumber',
                        'orderDate',
                        'prestDate',
                        'appointmentStatus',
                        'appointmentType',
                        'userGenerated',
                        'convenio',
                        'servicePgp'
                    ],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del servicio ejecutado'
                        },
                        idSede: {
                            type: 'integer',
                            description: 'ID de la sede'
                        },
                        idService: {
                            type: 'integer',
                            description: 'ID del servicio'
                        },
                        amount: {
                            type: 'integer',
                            description: 'Cantidad'
                        },
                        rate: {
                            type: 'integer',
                            description: 'Tarifa'
                        },
                        statusService: {
                            type: 'string',
                            description: 'Estado del servicio'
                        },
                        group: {
                            type: 'string',
                            description: 'Grupo del servicio'
                        },
                        subGroup: {
                            type: 'string',
                            description: 'Subgrupo del servicio'
                        },
                        documentType: {
                            type: 'integer',
                            description: 'Tipo de documento'
                        },
                        identification: {
                            type: 'integer',
                            description: 'Número de identificación'
                        },
                        patientName: {
                            type: 'string',
                            description: 'Nombre del paciente'
                        },
                        patientSex: {
                            type: 'string',
                            description: 'Sexo del paciente'
                        },
                        dateBirth: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de nacimiento'
                        },
                        riasGroup: {
                            type: 'string',
                            description: 'Grupo RIAS'
                        },
                        mainDx: {
                            type: 'string',
                            description: 'Diagnóstico principal'
                        },
                        medicoCode: {
                            type: 'string',
                            description: 'Código del médico remisor'
                        },
                        medicoName: {
                            type: 'string',
                            description: 'Nombre del médico remisor'
                        },
                        medicoSpc: {
                            type: 'string',
                            description: 'Especialidad del médico remisor'
                        },
                        nameContract: {
                            type: 'string',
                            description: 'Nombre del contrato'
                        },
                        userRegimen: {
                            type: 'string',
                            description: 'Régimen del usuario'
                        },
                        authorizationNumber: {
                            type: 'string',
                            description: 'Número de autorización'
                        },
                        orderDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de la orden'
                        },
                        prestDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de prestación'
                        },
                        appointmentStatus: {
                            type: 'string',
                            description: 'Estado de la cita'
                        },
                        appointmentType: {
                            type: 'string',
                            description: 'Tipo de cita'
                        },
                        userGenerated: {
                            type: 'string',
                            description: 'Usuario que generó el servicio'
                        },
                        convenio: {
                            type: 'string',
                            description: 'Convenio'
                        },
                        servicePgp: {
                            type: 'boolean',
                            description: 'Servicio PGP'
                        }
                    }
                },
                CupsRadicados: {
                    type: 'object',
                    required: ['code', 'DescriptionCode', 'status', 'observation', 'functionalUnit', 'idRadicacion', 'quantity'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del CUPS radicado'
                        },
                        code: {
                            type: 'integer',
                            description: 'Código CUPS'
                        },
                        DescriptionCode: {
                            type: 'string',
                            description: 'Descripción del CUPS'
                        },
                        status: {
                            type: 'integer',
                            description: 'Estado del CUPS'
                        },
                        observation: {
                            type: 'string',
                            description: 'Observaciones'
                        },
                        functionalUnit: {
                            type: 'integer',
                            description: 'ID de la unidad funcional'
                        },
                        idRadicacion: {
                            type: 'integer',
                            description: 'ID de la radicación'
                        },
                        statusRecoveryLatter: {
                            type: 'string',
                            description: 'Estado de la carta de recobro',
                            nullable: true
                        },
                        dateAuditRecoveryLatter: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de auditoría de la carta de recobro',
                            nullable: true
                        },
                        quantity: {
                            type: 'integer',
                            description: 'Cantidad'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de última modificación'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Archivos',
                description: 'Endpoints para la gestión de archivos de sgc'
            },
            {
                name: 'Accesorios',
                description: 'Endpoints para la gestión de accesorios de equipos'
            },
            {
                name: 'Autenticación',
                description: 'Endpoints relacionados con la autenticación de usuarios'
            },
            {
                name: 'Carpetas',
                description: 'Endpoints para la gestión de carpetas del sistema'
            },
            {
                name: 'Certificados',
                description: 'Endpoints para la gestión de certificados'
            },
            {
                name: 'Cirugías',
                description: 'Endpoints para la gestión de cirugías programadas'
            },
            {
                name: 'Componentes',
                description: 'Endpoints para la gestión de componentes de equipos'
            },
            {
                name: 'Convenios',
                description: 'Endpoints para la gestión de convenios'
            },
            {
                name: 'CUPS Radicados',
                description: 'Endpoints para la gestión de CUPS (Clasificación Única de Procedimientos en Salud)'
            },
            {
                name: 'Departamentos',
                description: 'Endpoints para la gestión de departamentos'
            },
            {
                name: 'Diagnósticos',
                description: 'Endpoints para la gestión de diagnósticos médicos'
            },
            {
                name: 'Dispositivos de Red',
                description: 'Endpoints para la gestión de dispositivos de red'
            },
            {
                name: 'Equipos',
                description: 'Endpoints para la gestión de equipos informáticos'
            },
            {
                name: 'Especialidades',
                description: 'Endpoints para la gestión de especialidades médicas'
            },
            {
                name: 'Estados',
                description: 'Endpoints para la gestión de estados del sistema'
            },
            {
                name: "Estados Seguimientos",
                description : "Enpoints para la gestion de los estados de seguimientos"
            },
            {
                name: 'Grupo de Servicios',
                description: 'Endpoints para la gestión de grupos de servicios'
            },
            {
                name: 'IPS Primaria',
                description: 'Endpoints para la gestión de IPS primarias'
            },
            {
                name: 'IPS Remite',
                description: 'Endpoints para la gestión de IPS Remitentes'
            },
            {
                name: 'Lugares de Radicación',
                description: 'Endpoints para la gestión de lugares de radicación'
            },
            {
                name: 'Municipios',
                description: 'Endpoints para la gestión de municipios'
            },
            {
                name: 'Pacientes',
                description: 'Endpoints para la gestión de pacientes'
            },
            {
                name: 'Radicación',
                description: 'Endpoints para la gestión de radicaciones'
            },
            {
                name: 'Radicadores',
                description: 'Endpoints para la gestión de radicadores'
            },
            {
                name: 'Reportes Excel',
                description: 'Endpoints para la generación de reportes en Excel'
            },
            {
                name: 'Roles',
                description: 'Endpoints para la gestión de roles del sistema'
            },
            {
                name: 'Seguimientos Auxiliares',
                description: 'Endpoints para la gestión de seguimientos auxiliares'
            },
            {
                name: "Seguimiento Dispositivos de Red",
                description: "Endpoints para la gestión de seguimientos de dispositivos de red"
            },
            {
                name: 'Seguimiento de Equipos',
                description: 'Endpoints para la gestión de seguimientos de equipos'
            },
            {
                name: 'Seguimientos Auxiliares Cirugías',
                description: 'Endpoints para la gestión de seguimientos auxiliares de cirugías'
            },
            {
                name: 'Servicios',
                description: 'Endpoints para la gestión de servicios'
            },
            {
                name: 'Servicios Solicitados',
                description: 'Endpoints para la gestión de servicios solicitados'
            },
            {
                name: 'Software',
                description: 'Endpoints para la gestión de software instalado en equipos'
            },
            {
                name: 'Soportes',
                description: 'Endpoints para la gestión de archivos soportes'
            },
            {
                name: 'Tipos de Documento',
                description: 'Endpoints para la gestión de tipos de documento'
            },
            {
                name: 'Unidades Funcionales',
                description: 'Endpoints para la gestión de unidades funcionales'
            },
            {
                name: 'Usuarios',
                description: 'Endpoints para la gestión de usuarios del sistema'
            },
            {
                name: 'Pausas Activas',
                description: 'Endpoints para la gestión de pausas activas'
            },
            {
                name: 'Eventos',
                description: 'Endpoints para la gestión de eventos del calendario'
            },
            {
                name: 'Notas Técnicas',
                description: 'Endpoints para la gestión de notas técnicas'
            },
            {
                name: "Servicios Generales",
                description: "Endpoints para la gestión de servicios generales"
            },
            {
                name: "Servicios Ejecutados",
                description: "Endpoints para la gestión de servicios ejecutados"
            },
            {
                name: 'Cartas de Recobro',
                description: 'Endpoints para la gestión de cartas de recobro'
            },
            {
                name: 'Guardar-email',
                description: 'Endpoints para guardar archivo adjunto del formulario "trabaja con nosotros" de la pagina web.'
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
}