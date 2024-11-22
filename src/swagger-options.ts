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
            }
        },
        tags: [
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
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
}