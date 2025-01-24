import { User } from "./Users";

export interface Follow {
  follower_id: string;
  following_id: string;
  follower: Omit<User, "followers" | "following" | "posts">;
  following: Omit<User, "followers" | "following" | "posts">;
}
