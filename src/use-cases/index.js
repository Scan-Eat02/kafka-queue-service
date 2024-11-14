// const lodash = require('lodash');

// Get (MySQL / Cockroach DB / Redis / Kafka) Connection
const config = require('../config');
const KafkaProducer = require('../utilities').KafkaProducer;

const kafkaProducer = new KafkaProducer({ kafkaConfig: config.kafka });
(async function () {
    await kafkaProducer.connect();
})();

// Import all use cases
const makePublishMessage = require('./publish-message');
// eslint-disable-next-line max-len

// Make use cases
const publishMessage = makePublishMessage({ kafkaProducer });

// Export use cases
module.exports = Object.freeze({
    publishMessage,
});
