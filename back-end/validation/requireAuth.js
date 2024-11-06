const jwt = require("jsonwebtoken");
const JSK = process.env.JWT_SECRET;

const requireAuth = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, JSK, async (err, decoded) => {
        if (err) {
          if (err.message === "jwt expired") {
            console.log(
              `${decoded?.user?.username || "Unknown user"}'s token expired`
            );

            try {
              console.log(
                `Creating new token for ${
                  decoded?.user?.username || "Unknown user"
                }`
              );

              const newClientTokenPayload = {
                user: decoded?.user,
                scopes: ["read:user", "write:user"],
              };

              const newToken = jwt.sign(newClientTokenPayload, JSK, {
                expiresIn: "30d",
              });

              res.setHeader("authorization", `Bearer ${newToken}`);

              req.user = {
                token: newToken,
              };

              console.log(
                `New token created for ${
                  decoded?.user?.username || "Unknown user"
                }`
              );
            } catch (error) {
              console.error("Error generating new token:", { error });
              return res.sendStatus(403);
            }
          } else {
            console.error("JWT verification error:", err);
            return res.sendStatus(403);
          }
        } else {
          req.user = {
            token,
            decodedUser: decoded?.user,
          };

          next();
        }
      });
    } else {
      res.sendStatus(401);
    }
  };
};

module.exports = { requireAuth };
