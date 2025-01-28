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
    });

    return res.json(users);
  }
}
