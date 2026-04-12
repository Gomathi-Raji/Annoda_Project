import crypto from "crypto";

const ADMIN_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const sessions = new Map();

const getAdminCredentials = () => ({
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123"
});

const issueToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + ADMIN_TOKEN_TTL_MS);
  return token;
};

const isTokenValid = (token) => {
  if (!token) return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt) return false;

  if (Date.now() > expiresAt) {
    sessions.delete(token);
    return false;
  }

  return true;
};

export const loginAdmin = (req, res) => {
  const { username, password } = req.body || {};
  const credentials = getAdminCredentials();

  if (username !== credentials.username || password !== credentials.password) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials"
    });
  }

  const token = issueToken();

  return res.status(200).json({
    success: true,
    data: {
      token,
      expiresInMs: ADMIN_TOKEN_TTL_MS
    }
  });
};

export const getAdminSession = (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin session is valid"
  });
};

export const logoutAdmin = (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (token) {
    sessions.delete(token);
  }

  return res.status(200).json({
    success: true,
    message: "Logged out"
  });
};

export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Admin authorization required"
    });
  }

  const token = authHeader.slice(7);

  if (!isTokenValid(token)) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin session"
    });
  }

  return next();
};