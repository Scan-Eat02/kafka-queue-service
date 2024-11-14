class KafkaProducer {
    constructor({ kafkaConfig }) {
        const Kafka = require('node-rdkafka');
        this.producer = new Kafka.HighLevelProducer({
            'metadata.broker.list': kafkaConfig.brokerList,
            'compression.codec': 'snappy',
            'retry.backoff.ms': 200,
            'message.send.max.retries': 10,
            'socket.keepalive.enable': true,
            'queue.buffering.max.messages': 100000,
            'queue.buffering.max.ms': 1,
            'batch.num.messages': 1000000,
            'dr_cb': false
        });

        // Any errors we encounter, including connection errors
        this.producer.on('event.error', (err) => {
            console.log('Error from producer', err);
        });

        this.producer.on('disconnected', (err) => {
            console.log(`Producer disconnected`, err);
        });

        this.producer.setPollInterval(100);
    }

    async connect() {
        this.producer.connect();
        return new Promise(((resolve, reject) => {
            this.producer.on('ready', () => {
                resolve(true);
            });
        }));
    }

    async produce({ topic, partition, message, key }) {
        partition = partition ? partition : null;
        key = key ? key : null;
        console.log(`Publishing on topic: ${topic}, Partition: ${partition}, Message: ${message.toString()}`);
        return new Promise((resolve, reject) => {
            try {
                this.producer.produce(topic,
                    partition,
                    message,
                    key,
                    Date.now(),
                    (err, offset) => {
                        console.log(`Published message to Offset: ${offset}`);
                        console.log(new Date());
                        if (err) {
                            reject(err);
                        } else {
                            resolve(offset);
                        }
                    });
                this.producer.poll();
            } catch (e) {
                console.log(`Error adding to ProcessingError topic:`, { message, e });
                reject(e);
            }
        });
    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            this.producer.disconnect((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = KafkaProducer;
