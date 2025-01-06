import { Answer } from "./Answer";
export interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  answers: Array<Answer>;
}
