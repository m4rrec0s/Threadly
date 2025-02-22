import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class FeedController {
  async getFeed(req: Request, res: Response) {
    const { user_id } = req.query;

    if (typeof user_id !== "string") {
      return res.status(400).json({ error: "Invalid user_id" });
    }

    // Buscar usuários seguidos
    const followedUsers = await prisma.follow.findMany({
      where: { follower_id: user_id },
    });

    const followedIds = followedUsers.map((f) => f.following_id);

    // Buscar postagens dos usuários seguidos
    const posts = await prisma.post.findMany({
      where: { user_id: { in: followedIds } },
      include: {
        images: true,
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    // Buscar sugestões de usuários baseadas em conexões mútuas
    const mutualFollowers = await prisma.follow.groupBy({
      by: ["following_id"],
      where: { follower_id: { in: followedIds } },
      _count: { following_id: true },
      orderBy: { _count: { following_id: "desc" } },
      take: 5,
    });

    // Buscar usuários mais populares
    const popularUsers = await prisma.follow.groupBy({
      by: ["following_id"],
      _count: { following_id: true },
      orderBy: { _count: { following_id: "desc" } },
      take: 5,
    });

    // Define a type for the suggestions
    type SuggestionItem = {
      suggestions: typeof mutualFollowers | typeof popularUsers;
    };

    // Formatar a resposta da API
    const feedItems: ((typeof posts)[0] | SuggestionItem)[] = [...posts];
    if (feedItems.length >= 5) {
      feedItems.splice(3, 0, { suggestions: mutualFollowers });
    } else if (feedItems.length === 0) {
      feedItems.push({ suggestions: popularUsers });
    }

    return res.json(feedItems);
  }
}
