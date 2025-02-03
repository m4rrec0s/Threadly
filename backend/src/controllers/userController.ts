import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class UserController {
  async index(req: Request, res: Response) {
    const { username, email, id, created_at } = req.query;

    const whereClause: any = {};
    if (username) whereClause.username = String(username);
    if (email) whereClause.email = String(email);
    if (id) whereClause.id = String(id);
    if (created_at) whereClause.created_at = new Date(created_at as string);

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        created_at: true,
      },
    });

    return res.json(users);
  }

  async getByUsername(req: Request, res: Response) {
    const { username } = req.params;
    const users = await prisma.user.findFirst({
      where: { username: String(username) },
    });
    return res.json(users);
  }

  async getByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const users = await prisma.user.findFirst({
      where: { email: String(email) },
    });
    return res.json(users);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const users = await prisma.user.findUnique({
      where: { id: String(id) },
    });
    return res.json(users);
  }

  async getByCreatedAt(req: Request, res: Response) {
    const { created_at } = req.params;
    const users = await prisma.user.findMany({
      where: { created_at: new Date(created_at) },
    });
    return res.json(users);
  }
}
