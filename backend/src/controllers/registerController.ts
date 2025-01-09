import { readData, writeData } from "../utils/databaseManager";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { User } from "../types/Users";

export default async function registerController(req: any, res: any) {
  const { name, email, username, password, image, posts } = req.body;

  if (!name || !email || !password || !username) {
    return res.status(400).json({
      message: "name, email, username, and password are required.",
    });
  }

  const users: User[] = await readData("users");

  const emailExists = users.find((user: User) => user.email === email);
  const usernameExists = users.find((user: User) => user.username === username);

  if (emailExists) {
    return res.status(400).json({
      message: "email already exists.",
    });
  }

  if (usernameExists) {
    return res.status(400).json({
      message: "username already exists.",
    });
  }

  const hashPassword = await bcrypt.hash(String(password), 8);

  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    password: hashPassword,
    username,
    create_at: new Date().toISOString(),
    image: image || "",
    posts: posts || [],
  };

  await writeData("users", newUser);

  return res.status(201).json(newUser);
}
