import redisStore from 'cache-manager-ioredis';
import { URL } from 'url';
import cacheManager, { Cache, CacheOptions, StoreConfig } from 'cache-manager';

const redisCacheFromUrl = (urlString: string, ttl: number): Cache => {
  const url = new URL(urlString);

  const config: StoreConfig & CacheOptions = {
    store: redisStore,
    host: url.hostname,
    port: url.port,
    password: url.password,
    db: url.pathname.replace('/', ''),
    ttl,
  };
  return cacheManager.caching(config);
};

export default redisCacheFromUrl;
