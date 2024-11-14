// index.js
const backendConfig = require('./backend-config');
const serviceConfig = require('./service-config');

// Combine the configurations into a single object
const config = {
    ...backendConfig,      // Spread the backend config
    ...serviceConfig       // Spread the service config
};

// Export the combined config
module.exports = config;
