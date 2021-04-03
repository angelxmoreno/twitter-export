import { Cache } from 'cache-manager';
import Env from '../../helpers/Env';
import redisCacheFromUrl from '../../helpers/redisCacheFromUrl';

const redisUrl = Env.string('REDIS_URL', '');
export const redisCache: Cache | undefined = redisUrl ? redisCacheFromUrl(redisUrl, 60) : undefined;
