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
        }
    },
    apis: ["./src/routes/*.ts"]
}