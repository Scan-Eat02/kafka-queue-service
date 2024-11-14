const formatResponse = require('./format-response').formatResponse;
const formatError = require('./format-response').formatError;
const uuid = require('uuid-v4');
const moment = require('moment');
// Import useCases
const useCases = require('../use-cases');

// Import Actions
const makeEnqueueJob = require('./enqueue-job');

const enqueueJob = makeEnqueueJob({
  publishMessage: useCases.publishMessage,
  moment: moment,
  formatResponse,
  formatError,
  uuid,
});

// Create Controller Object
const controller = Object.freeze({
  enqueueJob,
});

// Export Controller
module.exports = controller;
