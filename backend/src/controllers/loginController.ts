import { readData, writeData } from "../utils/databaseManager";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwtManager";
import { User } from "../types/Users";

export default async function loginController(req: any, res: any) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "email and password is required.",
    });
  }

  const users: User[] = await readData("users");

  const userExists = users.find((user: User) => user.username === username);

  if (!userExists) {
    return res.status(403).json({
      message: "invalid username or password.",
    });
  }

  const isValidPassword = await bcrypt.compare(password, userExists.password);

  if (!isValidPassword) {
    return res.status(403).json({
      message: "invalid username or password.",
    });
  }

  const token = createToken({ id: userExists.id });

  const loggedUser = {
    token,
    user: userExists,
  };

  return res.status(200).json(loggedUser);
}
