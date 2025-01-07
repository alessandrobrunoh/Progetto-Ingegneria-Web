import "dotenv/config";
import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { logRoutes } from "./utils/logRoutes";
import { printLines } from "./utils/printLines";
import { initializeWebSocket } from "./webSocket";


const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT: string | undefined = process.env.PORT;
const webSocket = initializeWebSocket(server);

app.use(
  cors({
    origin: process.env.ORIGIN_CORS_IP,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// ? Middleware to log all the requests
app.use((req: Request, res: Response, next) => {
  const method = req.method;
  const url = req.url;
  const params = req.params;
  const query = req.query;
  const body = req.body;

  // console.log(" NEW REQUEST:");
  // console.log("  - METHOD:", method);
  // console.log(`  - URL: ${url}`);
  // console.log("  - PARAMS:", params);
  // console.log("  - QUERY:", query);
  // console.log("  - BODY:", body);

  // printLines(25);
  next();
});

// ? create the routes get/post for the auth, and get the funciton from authController
import authRoutes from "./routes/authRoutes";
app.use("/api/auth", authRoutes);

// ? create the routes get/post for the room, and get the funciton from roomController
import roomRoutes from "./routes/roomRoutes";
app.use("/api/room", roomRoutes);

// ? create the routes get/post for the user, and get the funciton from userController
import userRoutes from "./routes/userRoutes";
app.use("/api/user", userRoutes);

// ? create the routes get/post for the player, and get the funciton from playerController
import playerRoutes from "./routes/playerRoutes";
app.use("/api/player", playerRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).send("404 Page not found");
});

server.listen(PORT, () => {
  printLines(50);

  console.log("STATUS: Running");
  console.log(`PORT: ${PORT}`);
  console.log(`CORS: ${process.env.ORIGIN_CORS_IP}`);
  console.log("");

  logRoutes();

  printLines(50);
});