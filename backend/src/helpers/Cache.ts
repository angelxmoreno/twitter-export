import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';
import redisCacheFromUrl from './redisCacheFromUrl';
import Env from './Env';

const memoryCache = cacheManager.caching({ store: 'memory', max: 100, ttl: 5 });
const redisCache = redisCacheFromUrl(Env.string('REDIS_URL'), 60);
const diskCache = cacheManager.caching({
  store: fsStore,
  options: {
    path: 'cache', // path for cached files
    ttl: 60 * 12, // time to life in seconds
    subdirs: true, // create subdirectories to reduce the
    // files in a single dir (default: false)
    zip: true, // zip files to save diskspace (default: false)
  },
});

export const buildCacheKey = (namespace: string, ...args: unknown[]): string =>
  `${namespace} - ${JSON.stringify(args)}`;
const Cache = cacheManager.multiCaching([memoryCache, redisCache, diskCache]);
export default Cache;
