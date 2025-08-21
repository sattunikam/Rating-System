// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Sequelize validation & unique constraint
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const details = err.errors?.map(e => e.message) || [err.message];
    return res.status(400).json({ message: "Validation failed", errors: details });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Default
  const code = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  res.status(code).json({ message: err.message || "Server Error" });
};

module.exports = errorHandler;
