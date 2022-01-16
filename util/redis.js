const redis = require('redis');

module.exports = {
  setupRedis: url => redis.createClient({ url }),
  injectRedis: rc => (req, res, next) => {
    res.locals.redis = rc;
    next();
  }
};
