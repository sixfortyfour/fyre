const { app } = require('@azure/functions');
const { Redis, RandomKeyCommand } = require('@upstash/redis');

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

app.http('encrypt', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const body = await request.json();

        try {
            const key = crypto.randomUUID();

            await redis.set(key, body, { ex: 300 });

            return { body: key };
        } catch (error) {
            console.log(error);
            return { status: 500, body: `Error: $(error)` };
        }
    }
});
