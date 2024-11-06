export const options = {
    definition: {
        openaapi: "3.0.0",
        info: {
            title: "Nordvitalips API",
            version: "1.0.0",
             description: "API para la aplicación intranet de Nordvitalips",
        },
        servers:[
            {
                url: "http://localhost:5173",
                description: "Development server"
            },
            {
                url: "https://test.nordvitalips.com",
                description: "Test server"
            },
            {
                url: "https://app.nordvitalips.com",
                description: "Production server"
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
}