import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const prisma = new PrismaClient();

export class PostController {
  async store(req: Request, res: Response) {
    const { content, user_id } = req.body;
    const requestImages = (req.files as Express.Multer.File[]) || [];

    if (!content || !user_id) {
      return res.status(400).json({
        message: "content and user_id are required.",
      });
    }

    const images = requestImages.map((image) => {
      return { url: image.filename };
    });

    const post = await prisma.post.create({
      data: {
        content,
        user: {
          connect: { id: user_id },
        },
        images: {
          create: images,
        },
      },
      include: {
        images: true,
        user: true,
        likes: true,
        comments: true,
      },
    });

    return res.json({ ...post });
  }

  async index(req: Request, res: Response) {
    const { user_id, id, _page = 1, _per_page = 25 } = req.query;
    const where: any = {};

    if (user_id) where.user_id = user_id;
    if (id) where.id = id;

    const page = parseInt(_page as string, 10);
    const perPage = parseInt(_per_page as string, 10);
    const skip = (page - 1) * perPage;

    const posts = await prisma.post.findMany({
      where,
      include: {
        images: true,
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: perPage,
    });

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await prisma.comment.count({
          where: { post_id: post.id },
        });

        const commentId = post.comments.map((comment) => comment.id);

        let totalAnswerCount = 0;
        for (const id of commentId) {
          const answerCount = await prisma.answer.count({
            where: { comment_id: id },
          });
          totalAnswerCount += answerCount;
        }

        return { ...post, commentCount: commentCount + totalAnswerCount };
      })
    );

    return res.json(postsWithCommentCount);
  }

  async getPostById(req: Request, res: Response) {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        images: true,
        user: true,
        likes: true,
        comments: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const commentCount = await prisma.comment.count({
      where: { post_id: post.id },
    });

    const commentId = post.comments.map((comment) => comment.id);

    let totalAnswerCount = 0;
    for (const id of commentId) {
      const answerCount = await prisma.answer.count({
        where: { comment_id: id },
      });
      totalAnswerCount += answerCount;
    }

    return res.json({ ...post, commentCount: commentCount + totalAnswerCount });
  }

  async deletePost(req: Request, res: Response) {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.images.forEach((image) => {
      const imagePath = path.join(__dirname, "..", "..", "uploads", image.url);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Failed to delete image file: ${imagePath}`, err);
        }
      });
    });

    await prisma.like.deleteMany({ where: { post_id: id } });
    await prisma.comment.deleteMany({ where: { post_id: id } });
    await prisma.image.deleteMany({ where: { post_id: id } });
    await prisma.post.delete({ where: { id } });

    return res.json({ message: "Post and associated data deleted." });
  }

  async getUsersWhoLikedPost(req: Request, res: Response) {
    const { id } = req.params;
    const likes = await prisma.like.findMany({
      where: { post_id: String(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });
    const users = likes.map((like) => like.user);
    return res.json(users);
  }
}
