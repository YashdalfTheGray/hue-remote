const getProtocols = async (req, res) => {
    const client = res.locals.redis;

    try {
        const keys = await client.keysAsync('*');
        res.json(keys);
    }
    catch (e) {
        res.status(500).json(e);
    }
};

const getOneProtocol = async (req, res) => {
    const client = res.locals.redis;

    try {
        const value = await client.hgetallAsync(req.params.id);
        res.json(value);
    }
    catch (e) {
        res.status(500).json(e);
    }
};

module.exports = {
    getProtocols,
    getOneProtocol
};
