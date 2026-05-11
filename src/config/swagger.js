import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NaijaPrice API",
      version: "1.0.0",
      description: "API documentation for the NaijaPrice platform",
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/docs/*.yaml", "./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
