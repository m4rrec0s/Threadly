import { Like } from "./Likes";
import { Comment } from "./Comments";
import { User } from "./Users";

export type Post = {
  id: string;
  image_url: string;
  content: string;
  created_at: string;
  likes: Array<Like>;
  comments: Array<Comment>;
  user: Pick<User, "id" | "name" | "image" | "username">;
};
