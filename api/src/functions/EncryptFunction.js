const { app } = require('@azure/functions');
const { Redis } = require('@upstash/redis');
require('dotenv').config();

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

app.http('encryptfunction', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const count = await redis.incr("counter");

        console.log(`Counter: ${count}`);

        return { body: `${count}` };
    }
});
