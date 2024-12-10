module.exports = function makePublishMessage({ kafkaProducer }) {
    return async function publishMessage({ key, topic, partition, message }) {
        if (typeof message !== 'string') {
            message = Buffer.from(JSON.stringify(message));
        } else {
            message = Buffer.from(message);
        }
        return await kafkaProducer.produce({ key, topic, message, partition });
    };
};
