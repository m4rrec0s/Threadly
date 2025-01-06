import { Post } from "./Posts";

export type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  image: string;
  posts: Post[];
};
