const jose = require("jose");

const getSecretKey = async () => {
  return new TextEncoder().encode(process.env.JWT_SECRET);
};

const createToken = async (payload, expiresIn = "30d") => {
  const key = await getSecretKey();
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .setIssuedAt()
    .sign(key);
};

const verifyToken = async (token) => {
  const key = await getSecretKey();
  const verifiedToken = await jose.jwtVerify(token, key);
  console.log("=== verifyToken", { token }, { verifiedToken }, "===");
  return verifiedToken;
};

const decodeToken = (token) => {
  const decoded = jose.decodeJwt(token);
  console.log("=== decodeToken", { token }, { decoded }, "===");
  return decoded;
};

const requireAuth = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const cookieHeader = req.headers.cookie;

    let token = null;

    console.log("=== requireAuth", { authHeader }, { cookieHeader }, "===");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (cookieHeader) {
      token = cookieHeader
        ?.split(";")
        ?.find((cookie) => cookie.trim().startsWith("authToken="))
        ?.split("=")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    try {
      const { payload } = await verifyToken(token);
      req.user = {
        token,
        decodedUser: payload.user,
      };
      return next();
    } catch (err) {
      if (err instanceof jose.errors.JWTExpired) {
        const expiredPayload = decodeToken(token);

        if (!expiredPayload?.user) {
          return res.status(403).json({ error: "Expired token is invalid" });
        }

        const newPayload = {
          user: expiredPayload.user,
        };

        try {
          const newToken = await createToken(newPayload, "30d");

          res.setHeader("authorization", `Bearer ${newToken}`);
          req.user = {
            token: newToken,
            decodedUser: expiredPayload.user,
          };

          return next();
        } catch (refreshError) {
          console.error("Error generating new token:", refreshError);
          return res.status(403).json({ error: "Failed to refresh token" });
        }
      }

      console.error("Token verification failed:", err);
      return res.status(403).json({ error: "Invalid or malformed token" });
    }
  };
};

module.exports = {
  createToken,
  requireAuth,
};
