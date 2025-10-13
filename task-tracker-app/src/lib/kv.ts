import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

// Create a KV-compatible interface
export const kv = {
  async hgetall(key: string) {
    const data = await redis.hgetall(key);
    // Convert empty object to null to match expected behavior
    return Object.keys(data).length === 0 ? null : data;
  },

  async hset(key: string, values: Record<string, any>) {
    const entries = Object.entries(values).flat();
    if (entries.length === 0) return;
    await redis.hset(key, ...entries.map(v => typeof v === 'object' ? JSON.stringify(v) : v));
  },

  async hdel(key: string, field: string) {
    await redis.hdel(key, field);
  }
};
