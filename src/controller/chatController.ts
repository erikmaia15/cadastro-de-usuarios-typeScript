import express, { Request, Response } from "express";
import ws from "ws";
import { Server } from "socket.io";
import http from "http";
const app = express();
const server = new Server();
app.get("/", (req: Request, res: Response) => {
  server.listen(2000);
});
export default app;
