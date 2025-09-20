import { createClient } from "redis"
import dotenv from "dotenv"

dotenv.config();

export const redis = createClient({
  url: process.env.UPSTASH_REDIS_URL
});

redis.on("error", function(err) {
  throw err;
});
try {
  await redis.connect()
} catch (error) {
  console.log("cant connect to redis")
}
async function main() {
await redis.set('foo','bar');
const value = await redis.get('foo');
console.log(value)
}
main();
