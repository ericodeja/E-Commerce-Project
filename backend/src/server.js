import { connectDB } from "./db/mongoose.js";
import mongoose from "mongoose";

async function startServer(app, PORT) {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, shutting down gracefully");
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

export default startServer;
