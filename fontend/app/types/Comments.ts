import { Answer } from "./Answer";
import { Post } from "./Posts";
import { User } from "./Users";

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  answers: Array<Answer>;
  post_id: string;
  post: Post;
  user: User;
}
