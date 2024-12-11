const makeEnqueueJob = ({
    publishMessage,
    formatResponse,
    formatError
}) => {
    return async function enqueueJob(req, res) {
        try {
            const { topic, key, partition, message, delay, jobId, reEnqueue } = req.body;

            console.info(`Got new message to publish for topic -> ${topic}
            delay -> ${delay} jobId -> ${jobId} key -> ${key} partition -> ${partition}`);

            console.info(`Calling publishMessage for ${topic}`);
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
