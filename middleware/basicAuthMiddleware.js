const basicAuth = require("basic-auth");

const USERNAME = process.env.VALIDATION_USER;
const PASSWORD = process.env.VALIDATION_PASS;

const basicAuthMiddleware = (req, res, next) => {
  const user = basicAuth(req);

  if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
    res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: Invalid credentials",
    });
  }

  next(); // ✅ passed
};

module.exports = basicAuthMiddleware;
// This middleware checks for Basic Auth credentials in the request headers.
// If credentials are missing or incorrect, it responds with a 401 Unauthorized status.
