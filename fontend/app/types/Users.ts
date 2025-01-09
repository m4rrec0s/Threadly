import { Post } from "./Posts";

export type User = {
  id: string;
  username: string;
  email: string;
  create_at: string;
  name: string;
  image: string;
  posts: Post[];
};
