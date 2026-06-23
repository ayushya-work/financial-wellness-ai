// In-memory token store: maps token -> userId
const tokenStore = {};

/**
 * Generate a unique token for a user
 */
function generateToken(userId) {
  const token = `token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  tokenStore[token] = userId;
  return token;
}

/**
 * Middleware to validate Bearer token and attach user context
 * Routes using this middleware can access req.user.id
 */
function validateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [scheme, token] = authHeader.split(' ');
  
  if (scheme !== 'Bearer') {
    return res.status(401).json({ error: "Invalid Authorization scheme. Use Bearer token" });
  }

  if (!token) {
    return res.status(401).json({ error: "Missing token in Authorization header" });
  }

  const userId = tokenStore[token];
  if (!userId) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Attach user context to request
  req.user = { id: userId };
  next();
}

/**
 * Middleware to check if requested userId matches authenticated user
 * Use after validateToken to prevent cross-user data access
 */
function ensureUserOwnership(req, res, next) {
  const requestedUserId = req.params.userId;
  
  if (!requestedUserId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  if (req.user.id !== requestedUserId) {
    return res.status(403).json({ error: "Unauthorized: Cannot access other user's data" });
  }

  next();
}

module.exports = { generateToken, validateToken, ensureUserOwnership, tokenStore };
