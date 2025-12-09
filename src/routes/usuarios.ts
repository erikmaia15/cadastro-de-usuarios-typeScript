import express from "express";
import usuariosController from "../controller/usuariosController";
const router = express.Router();
router.use("/usuarios", usuariosController);
export default router;
