import {connectDB, closeDB} from "./db/mongo.js";

async function startServer(app, PORT) {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on("SIGINT", async () => {
      console.log("Shutting down...");
      try {
        await closeDB();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}


export default startServer;
