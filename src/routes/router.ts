import express from "express";
import usuariosController from "../controller/usuariosController";
import chatController from "../controller/chatController";
const router = express.Router();
router.use("/usuarios", usuariosController);
router.use("/chat", chatController);
export default router;
