import { Post } from "./Posts";
import { Follow } from "./Follows";

export type User = {
  id: string;
  username: string;
  email: string;
  create_at: string;
  name: string;
  image: string;
  posts: Post[];
  followers: Follow[];
  following: Follow[];
};
