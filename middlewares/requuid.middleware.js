import crypto from 'crypto';

const REQUEST_UUID_MIDDLEWARE = (req, res, next) => {
    
    const reqId = crypto.randomUUID();

    req.reqId = reqId;
    res.setHeader('X-Request-ID', reqId);

    next();
}

export default REQUEST_UUID_MIDDLEWARE;