import { Post } from "./Posts";

export type User = {
  id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  image: string;
  create_at: string;
  posts: Post[];
};
