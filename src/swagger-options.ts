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
                        nitMunicipio: {
                            type: 'string',
                            description: 'NIT del municipio'
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
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
}