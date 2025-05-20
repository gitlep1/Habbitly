import { verify, decode, sign } from "jsonwebtoken";
const JWTS = process.env.JWT_SECRET;
import { promisify } from "util";

const requireAuth = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = await promisify(verify)(token, JWTS);

      req.user = {
        token,
        decodedUser: decoded.user,
      };

      next();
    } catch (err) {
      console.log("=== requireAuth err", { err }, "===");
      if (err.name === "TokenExpiredError") {
        const decoded = decode(token);

        console.log(`${decoded.user.username}'s token expired`);

        try {
          console.log(`Generating new token for ${decoded.user.username}`);

          const newClientTokenPayload = {
            user: decoded.user,
            scopes: ["read:user", "write:user"],
          };

          const newToken = sign(newClientTokenPayload, JWTS, {
            expiresIn: "30d",
          });

          res.setHeader("authorization", `Bearer ${newToken}`);
          req.user = {
            token: newToken,
            decodedUser: decoded.user,
          };

          console.log(`New token created for ${decoded.user.username}`);
          next();
        } catch (error) {
          console.error("Error generating new token:", error);
          return res
            .status(403)
            .json({ error: "Failed to generate new token" });
        }
      } else {
        console.error("JWT verification error:", err);
        return res.status(403).json({ error: "Invalid or malformed token" });
      }
    }
  };
};

export default { requireAuth };
