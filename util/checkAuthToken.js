// eslint-disable-next-line import/prefer-default-export
export const checkAuthToken = (req, res, next) => {
  if (req.method === 'POST' && req.body.accessToken) {
    if (
      req.body.accessToken.toLowerCase() ===
      process.env.HUE_REMOTE_TOKEN.toLowerCase()
    ) {
      next();
    } else {
      res.status(403).json({
        success: false,
        code: 403,
        reason: 'Not authorized'
      });
    }
  } else if (req.get('Authorization')) {
    const authMethod = req.get('Authorization').split(' ')[0];
    const authToken = req.get('Authorization').split(' ')[1].toLowerCase();

    if (authMethod !== 'Bearer') {
      res.status(401).json({
        success: false,
        code: 401,
        reason: 'Malformed auth header'
      });
    } else if (authToken !== process.env.HUE_REMOTE_TOKEN.toLowerCase()) {
      res.status(403).json({
        success: false,
        code: 403,
        reason: 'Not authorized'
      });
    } else if (authToken === process.env.HUE_REMOTE_TOKEN.toLowerCase()) {
      next();
    }
  } else {
    res.status(401).json({
      success: false,
      code: 401,
      reason: 'No auth token found in request'
    });
  }
};
