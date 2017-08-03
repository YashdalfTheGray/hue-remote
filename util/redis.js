const { promisifyAll } = require('bluebird');
const redis = require('redis');

promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);

module.exports = {
    setupRedis: url => redis.createClient(url),
    injectRedis: rc => (req, res, next) => {
        res.locals.redis = rc;
        next();
    }
};
