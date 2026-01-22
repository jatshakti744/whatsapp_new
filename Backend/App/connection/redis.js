const redis = require('redis');
let client;
const connectRedis = async () => {
  client = redis.createClient({ socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT } });
  client.on('error', err => console.error('Redis error', err));
  await client.connect();
  console.log('Redis connected');
};
const getRedisClient = () => client;
module.exports = { connectRedis, getRedisClient };
