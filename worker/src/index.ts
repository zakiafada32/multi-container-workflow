import { keys } from './keys';

import redis from 'redis';

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

function fib(index: number): number {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  const fibResult = fib(parseInt(message)).toString();
  redisClient.hset('values', message, fibResult);
});
sub.subscribe('insert');
