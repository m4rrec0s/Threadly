import { Post } from "./Posts";

export interface Suggestion {
  _count?: {
    following_id?: number;
  };
  following_id: string;
}

interface SuggestionFeed {
  suggestions: Suggestion[];
}

export type FeedItem = Post | SuggestionFeed;

export type Feed = FeedItem[];
