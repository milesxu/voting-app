const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  let token = req.body.token || req.params.token
    || req.headers['x-access-token'];
  if (!token) {
    return res.status(401).end({
      success: false,
      message: 'No token provided.'
    });
  }
  jwt.verify(token, process.env.SECRET_STRING, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Authentication failed.'
      });
    }
    //console.log(jwt.decode(token, { complete: true }));
    //TODO: Check if user exist and whether it have such privilege to access.
    req.body.decoded = decoded;
    //console.log(decoded);
    next();
  })
};