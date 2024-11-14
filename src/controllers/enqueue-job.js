const makeEnqueueJob = ({
    publishMessage,
    addDelayedJob,
    publishMessageWithJobId,
    moment,
    formatResponse,
    formatError,
    uuid,
}) => {
    return async function enqueueJob(req, res) {
        try {
            const { topic, key, partition, message, delay, jobId, reEnqueue } = req.body;
            const linkname = message.linkname || message.hostname || message.host || req.body.linkname;

            console.info(`Got new message to publish for link: ${linkname} topic -> ${topic}
            delay -> ${delay} jobId -> ${jobId} key -> ${key} partition -> ${partition}`);

            if ((delay || jobId) && !linkname) {
                console.error('Returning error as linkname not provided');
                const errorResponse = formatResponse({
                    contentType: 'application/json',
                    statusCode: 400,
                    body: { message: 'linkname is required for delayed or job-specific messages' },
                });
                return res.status(400).json(errorResponse);
            }

            if (typeof message !== 'string') {
                message['__KAFKA_EVENT_ID__'] = `${linkname}-${topic}-${uuid()}`;
            }

            if (delay) {
                console.info(`Calling addDelayedJob for ${linkname}-${topic}`);
                await addDelayedJob({ key, linkname, topic, partition, message, delay, jobId, moment });
            } else if (jobId) {
                console.info(`Calling publishMessageWithJobId for ${linkname}-${topic}-${jobId}`);
                await publishMessageWithJobId({ key, reEnqueue, linkname, topic, partition, jobId, message });
            } else {
                console.info(`Calling publishMessage for ${linkname}-${topic}`);
                await publishMessage({ key, topic, partition, message });
            }

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
