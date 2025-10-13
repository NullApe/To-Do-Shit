import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

// Create a KV-compatible interface
export const kv = {
  async hgetall(key: string) {
    const data = await redis.hgetall(key);
    // Convert empty object to null to match expected behavior
    if (Object.keys(data).length === 0) return null;

    // Parse JSON strings back to objects
    const parsed: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(data)) {
      try {
        parsed[field] = JSON.parse(value);
      } catch {
        parsed[field] = value;
      }
    }
    return parsed;
  },

  async hset(key: string, values: Record<string, unknown>) {
    const entries = Object.entries(values).flat();
    if (entries.length === 0) return;
    const stringified = entries.map(v =>
      typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)
    );
    await redis.hset(key, ...stringified);
  },

  async hdel(key: string, field: string) {
    await redis.hdel(key, field);
  }
};
