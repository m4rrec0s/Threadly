import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class AnswerController {
  async store(req: Request, res: Response) {
    const { content, author_id, comment_id } = req.body;

    if (!content || !author_id || !comment_id) {
      return res.status(400).json({
        message: "content, author_id, and comment_id are required.",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: comment_id },
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        user: {
          connect: { id: author_id },
        },
        comment: {
          connect: { id: comment_id },
        },
      },
    });

    return res.status(201).json(answer);
  }

  async index(req: Request, res: Response) {
    const answers = await prisma.answer.findMany();
    const { author_id, comment_id } = req.query;

    if (author_id) {
      const answers = await prisma.answer.findMany({
        where: { author_id: String(author_id) },
      });
      return res.json(answers);
    }

    if (comment_id) {
      const answers = await prisma.answer.findMany({
        where: { comment_id: String(comment_id) },
      });
      return res.json(answers);
    }

    return res.json(answers);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { content } = req.body;

    const answer = await prisma.answer.update({
      where: { id },
      data: { content },
    });

    return res.json(answer);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const answer = await prisma.answer.delete({
      where: { id },
    });

    return res.json(answer);
  }
}
