const makeEnqueueJob = ({
    publishMessage,
    formatResponse,
    formatError
}) => {
    return async function enqueueJob(req, res) {
        try {
            const { topic, key, partition, message, delay, jobId, reEnqueue } = req.body;
            const linkname = message.linkname || message.hostname || message.host || req.body.linkname || null;

            console.info(`Got new message to publish for link: ${linkname} topic -> ${topic}
            delay -> ${delay} jobId -> ${jobId} key -> ${key} partition -> ${partition}`);

            console.info(`Calling publishMessage for ${linkname}-${topic}`);
            await publishMessage({ key, topic, partition, message });

            const successResponse = formatResponse({
                contentType: 'application/json',
                statusCode: 200,
                body: { message: 'Job enqueued successfully' },
            });
            res.status(200).json(successResponse);

        } catch (error) {
            console.error('Got error in enqueue job controller', error);
            const errorResponse = formatError({
                error,
                contentType: 'application/json',
                statusCode: 500,
                message: 'Failed to enqueue job',
            });
            res.status(500).json(errorResponse);
        }
    };
};

module.exports = makeEnqueueJob;
