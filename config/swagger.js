import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "../docs/registry.js";
import { PROJECT_TITLE, PROJECT_NAME, API_VERSION } from "./config.js";
import "../docs/auth.openapi.js";
import "../docs/task.openapi.js";
import "../docs/health.openapi.js";

const generator = new OpenApiGeneratorV3(registry.definitions);
const swaggerSpec = generator.generateDocument({
    openapi: "3.0.3",
    info: {
        title: PROJECT_TITLE,
        version: API_VERSION,
        description: PROJECT_NAME + " API Documentation",
    },
    servers: [{ url: "/", description: "Current server" }],
});

export default swaggerSpec;