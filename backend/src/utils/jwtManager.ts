import jwt from "jsonwebtoken";

type JwtPayload = {
  id: string;
};

const SECRET_KEY = "123456absd";

export function createToken(payload: JwtPayload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET_KEY) as JwtPayload;
}
