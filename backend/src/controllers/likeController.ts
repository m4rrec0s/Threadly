import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { PostController } from "./postController";

const prisma = new PrismaClient();

export class LikeController {
  async store(req: Request, res: Response) {
    const { user_id, post_id } = req.body;

    if (!user_id || !post_id) {
      return res.status(400).json({
        message: "user_id and post_id are required.",
      });
    }

    const like = await prisma.like.create({
      data: {
        user: {
          connect: { id: user_id },
        },
        post: {
          connect: { id: post_id },
        },
      },
    });

    return res.status(201).json(like);
  }

  async index(req: Request, res: Response) {
    const posts = await prisma.like.findMany();

    return res.json(posts);
  }

  async deleteLike(req: Request, res: Response) {
    const { post_id, user_id } = req.body;

    if (!post_id || !user_id) {
      return res.status(400).json({
        message: "post_id and user_id are required.",
      });
    }

    const like = await prisma.like.deleteMany({
      where: {
        post_id: post_id,
        user_id: user_id,
      },
    });

    if (like.count === 0) {
      return res.status(404).json({
        message: "Like not found.",
      });
    }

    return res.json({
      message: "Like deleted successfully.",
    });
  }
}
