import { Like } from "./Likes";
import { Comment } from "./Comments";
import { User } from "./Users";
import { Image } from "./Images";

export type Post = {
  id: string;
  images: Image[];
  content: string;
  created_at: string;
  likes: Array<Like>;
  comments: Array<Comment>;
  user: Pick<User, "id" | "name" | "image" | "username">;
};
