import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movent API",
      version: "1.0.0",
      description: "API documentation for the Movent platform",
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },
  apis: ["./src/docs/openapi.yaml", "./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
