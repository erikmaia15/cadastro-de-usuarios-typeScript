import express, { Request, Response } from "express";
import usuarioService from "../service/usuariosService";
import tokenJwt from "../../utils/tokenJwt";
const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  const { fullName, password, email } = req.body;

  if (!fullName?.trim()) {
    return res.status(400).json({ error: "fullName é obrigatório." });
  }

  if (!email?.trim()) {
    return res.status(400).json({ error: "email é obrigatório." });
  }
  if (!password?.trim()) {
    return res.status(400).json({ error: "Senha é obrigatória." });
  }
  const novoUsuario = await usuarioService.postUsuario({
    fullName,
    email,
    password,
  });

  if (!novoUsuario.ok) {
    console.log(novoUsuario.error);
    return res.status(400).json({ error: novoUsuario.error });
  }

  return res
    .status(201)
    .json({ message: "Usuário criado com sucesso!", user: novoUsuario.data });
});

router.post("/login", async (req: Request, res: Response) => {
  const { password, email } = req.body;
  if (!email?.trim()) {
    return res.status(400).json({ error: "email é obrigatório." });
  }
  if (!password?.trim()) {
    return res.status(400).json({ error: "Senha é obrigatória." });
  }
  const user = await usuarioService.usuarioLogin({
    email,
    password,
  });
  console.log(user);
  if (!user?.response?.ok) {
    return res.status(404).json({ erro: user?.message });
  } else {
    return res.status(200).json({ resposta: user.response });
  }
});

router.get("/info-user", async (req: Request, res: Response) => {
  if (!req.headers.authorization || req.headers.authorization === null) {
    res.status(401).json({ message: "Usuário não autorizado, faça login!" });
  } else {
    const token = req.headers.authorization;
    const response = await tokenJwt.decodificarToken(token);
    if (!response.ok) {
      res.status(401).json({ message: response.message });
    } else {
      res.status(200).json({
        message: "Token decodificado com sucesso!",
        token: response.tokenDecoded,
      });
    }
  }
});

router.get("/listar-usuarios", async (req: Request, res: Response) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization === null ||
    req.headers.authorization === undefined
  ) {
    res.status(401).json({ message: "Precisa se autenticar!" });
  }
  const token: string = req.headers.authorization as string;
  if (!token || token === null || token === undefined) {
    res.status(401).json({ message: "Precisa se autenticar!" });
  }
  const cleanToken = token.replace("Bearer ", "");

  const response = await usuarioService.listarUsuarios(cleanToken);
  if (!response || !response.ok) {
    res.status(404).json({ message: response.message });
  }
  if (response.ok) {
    res.status(200).json({ message: response.message, users: response.users });
  }
});

export default router;
