const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((err) => err.message);
    return res.status(400).json({ error: messages });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} already in use.` });
  }
  next(err);
};

export { errorHandler };
