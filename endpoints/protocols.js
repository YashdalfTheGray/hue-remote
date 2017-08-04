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
        const value = await client.hgetallAsync(req.params.name);

        if (!value) {
            res.sendStatus(404);
        }
        else {
            res.json(value);
        }
    }
    catch (e) {
        res.status(500).json(e);
    }
};

const createProtocol = async (req, res) => {
    const client = res.locals.redis;

    try {
        const value = await client.hmsetAsync(req.body.name, req.body.details);
        res.status(201).json(value);
    }
    catch (e) {
        res.status(500).json(e);
    }
};

const deleteProtocol = async (req, res) => {
    const client = res.locals.redis;

    try {
        const value = await client.delAsync(req.params.name);
        res.json(value);
    }
    catch (e) {
        res.status(500).json(e);
    }
};

const updateProtocol = async (req, res) => {
    const client = res.locals.redis;

    try {
        const value = await client.hmsetAsync(req.params.name, req.body);
        res.json(value);
    }
    catch (e) {
        res.status(500).json(e);
    }
};

module.exports = {
    getProtocols,
    getOneProtocol,
    createProtocol,
    deleteProtocol,
    updateProtocol
};
