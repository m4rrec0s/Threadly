import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwtManager";

const prisma = new PrismaClient();

export default async function loginController(req: any, res: any) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "username and password are required.",
    });
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return res.status(403).json({
      message: "invalid username or password.",
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(403).json({
      message: "invalid username or password.",
    });
  }

  const token = createToken({ id: user.id });

  const loggedUser = {
    token,
    user,
  };

  return res.status(200).json(loggedUser);
}
