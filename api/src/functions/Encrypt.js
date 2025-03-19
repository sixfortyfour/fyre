const { app } = require('@azure/functions');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

app.http('encrypt', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const count = await redis.incr("counter");

        console.log(`Counter: ${count}`);

        return { body: `${count}` };
    }
});
