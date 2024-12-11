const config = {
    serviceName: 'Kafka Queue',
    kafkaTopics: {
        'SendEmail': {
            topic: 'SendEmail',
            partition: null,
        },
    },
    serviceEndpointPrefix: '/kafka_queue_service',
};
module.exports = config;
