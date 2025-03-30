const { app } = require('@azure/functions');
const { Redis, RandomKeyCommand } = require('@upstash/redis');

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

app.http('decrypt', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'decrypt/{redisKey}',
    handler: async (request, context) => {
        try {
            const params = new URLSearchParams(request.params);

            const key = request.params.redisKey;

            console.log(`Key: ${key}`);

            const message = await redis.get(key);

            if (!message) {
                return { status: 404, body: 'Key not found' };
            } else {
                await redis.del(key);
                console.log(`Key ${key} deleted`);
            }

            console.log(`Message: ${JSON.stringify(message)}`);
            // Delete the key after retrieving the message

            return { body: `${JSON.stringify(message)}` };
        } catch (error) {
            console.log(error);
            return { status: 500, body: `Error: ${error}` };
        }
    }
});