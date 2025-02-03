import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class CommentController {
  async store(req: Request, res: Response) {
    const { content, author_id, post_id } = req.body;

    if (!content || !author_id || !post_id) {
      return res.status(400).json({
        message: "content, author_id, and post_id are required.",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        user: {
          connect: { id: author_id },
        },
        post: {
          connect: { id: post_id },
        },
      },
    });

    return res.status(201).json(comment);
  }

  async index(req: Request, res: Response) {
    const comments = await prisma.comment.findMany({
      include: {
        answers: true,
      },
    });

    return res.json(comments);
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.params;

    const comment = await prisma.comment.delete({
      where: {
        id: id,
      },
    });

    return res.json(comment);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return res.json(comment);
  }

  async getByPostId(req: Request, res: Response) {
    const { post_id } = req.params;
    if (!post_id) {
      return res.status(400).json({ message: "post_id é obrigatório." });
    }
    const comments = await prisma.comment.findMany({
      where: { post_id },
    });
    return res.json(comments);
  }
}
