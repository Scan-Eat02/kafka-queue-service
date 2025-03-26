const env = process.env.NODE_ENV || "dev";

const backendConfig = require(`./${env === "dev" ? "backend-config" : "prod-backend-config"}`);
const serviceConfig = require(`./${env === "dev" ? "service-config" : "prod-service-config"}`);

const config = {
  ...backendConfig,
  ...serviceConfig,
};

module.exports = config;
