import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';

export const diskCache = cacheManager.caching({
  store: fsStore,
  options: {
    path: 'cache', // path for cached files
    ttl: 60 * 12, // time to life in seconds
    subdirs: true, // create subdirectories to reduce the
    // files in a single dir (default: false)
    zip: true, // zip files to save diskspace (default: false)
  },
});
