const formatResponse = require('./format-response').formatResponse;
const formatError = require('./format-response').formatError;
// Import useCases
const useCases = require('../use-cases');

// Import Actions
const makeEnqueueJob = require('./enqueue-job');

const enqueueJob = makeEnqueueJob({
  publishMessage: useCases.publishMessage,
  formatResponse,
  formatError,
});

// Create Controller Object
const controller = Object.freeze({
  enqueueJob,
});

// Export Controller
module.exports = controller;
