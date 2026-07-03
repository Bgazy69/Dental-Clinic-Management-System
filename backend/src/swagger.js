const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dental Clinic API',
            version: '1.0.0',
            description: 'API системы управления стоматологической клиникой'
        },
        servers: [{ url: 'http://localhost:5000/api' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js']
}

module.exports = swaggerJsdoc(options)