import redis from 'redis';

export const setupRedis = url => redis.createClient({ url });
export const injectRedis = rc => (req, res, next) => {
  res.locals.redis = rc;
  next();
};
