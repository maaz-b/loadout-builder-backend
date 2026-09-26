import { app } from "./app.js";
import { connectDb } from "./db.js";

const PORT = process.env.PORT || 3000;

try {
  await connectDb();
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}/`),
  );
} catch (error) {
  console.error(`Error: ${error.stack}`);
  console.error("db connection failed, server shutting down.");
  process.exit(1);
}
