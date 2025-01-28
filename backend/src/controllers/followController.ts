import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class FollowController {
  async follow(req: Request, res: Response) {
    const { follower_id, following_id } = req.body;

    if (!follower_id || !following_id) {
      return res.status(400).json({
        message: "follower_id and following_id are required.",
      });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id,
          following_id,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({
        message: "You are already following this user.",
      });
    }

    const follow = await prisma.follow.create({
      data: {
        follower_id,
        following_id,
      },
    });

    return res.status(201).json(follow);
  }

  async unfollow(req: Request, res: Response) {
    const { follower_id, following_id } = req.body;

    if (!follower_id || !following_id) {
      return res.status(400).json({
        message: "follower_id and following_id are required.",
      });
    }

    const follow = await prisma.follow.deleteMany({
      where: {
        follower_id,
        following_id,
      },
    });

    if (follow.count === 0) {
      return res.status(404).json({
        message: "Follow relationship not found.",
      });
    }

    return res.json({
      message: "Unfollowed successfully.",
    });
  }

  async getFollowers(req: Request, res: Response) {
    const { user_id } = req.params;

    const followers = await prisma.follow.findMany({
      where: { following_id: user_id },
      include: { follower: true },
    });

    return res.json(followers);
  }

  async getFollowing(req: Request, res: Response) {
    const { user_id } = req.params;

    const following = await prisma.follow.findMany({
      where: { follower_id: user_id },
      include: { following: true },
    });

    return res.json(following);
  }
}
