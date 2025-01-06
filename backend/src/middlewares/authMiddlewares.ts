import { readData } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export async function authMiddleware(req: any, res: any, next: any) {
  const { authorization } = req.headers;

  if (!authorization || authorization.split(" ")[0] !== "Bearer") {
    return res.status(401).json({
      message: "unauthorized.",
    });
  }

  const token = verifyToken(authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({
      message: "unauthorized.",
    });
  }

  const users = await readData("users");

  const userExists = users.find((user: any) => user.id === token.id);

  if (!userExists) {
    return res.status(401).json({
      message: "unauthorized.",
    });
  }

  next();
}
