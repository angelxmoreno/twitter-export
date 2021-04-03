import cacheManager, { Cache } from 'cache-manager';
import { memoryCache } from './memory';
import { redisCache } from './redis';
import { diskCache } from './file';

const cacheEngines: Cache[] = [];

[memoryCache, redisCache, diskCache].forEach(engine => {
  if (engine) {
    cacheEngines.push(engine);
  }
});

export const buildCacheKey = (namespace: string, ...args: unknown[]): string =>
  `${namespace} - ${JSON.stringify(args)}`;
export default cacheManager.multiCaching(cacheEngines);
