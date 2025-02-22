const jwt = require("jsonwebtoken");

const scopeAuth = (requiredScopes) => {
  return (req, res, next) => {
    const { token } = req.user;

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      const { scopes } = decoded;

      const hasRequiredScopes = requiredScopes.every((requiredScope) =>
        scopes.includes(requiredScope)
      );

      if (!hasRequiredScopes) {
        return res.status(403).json({ message: "Insufficient privileges" });
      }

      req.user = {
        ...decoded,
        token,
      };
      next();
    });
  };
};

module.exports = { scopeAuth };
