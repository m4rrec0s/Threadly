import Image from "next/image";
import { Post } from "../types/Posts";
import { User } from "../types/Users";
import { dateConvert } from "../helpers/dateConvert";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PostItemProps {
  post: Post;
  users: User[];
}

const PostItem: React.FC<PostItemProps> = ({ post, users }) => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`${post.user.image}`}
            alt={"user image - " + post.user.id}
          />
          <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-normal text-base">{post.user.username}</h3>
      </div>

      <div className="mt-3">
        <div className="relative w-[468px] h-[585px]">
          <Image
            src={`${post.image_url}?random=${
              Math.floor(Math.random() * 100) + 1
            }`}
            alt={"post image " + post.id}
            priority
            layout="fill"
            className="object-cover rounded-lg"
          />
        </div>
        <PostActions post={post} users={users} />
        <div className="mt-3">
          <p className="text-base">
            <span className="text-base font-semibold">{post.user.name}</span>{" "}
            {post.content}
          </p>
          <span className="text-xs text-gray-500">
            {dateConvert(post.created_at)}
          </span>
        </div>
      </div>

      <PostComments post={post} users={users} />
    </div>
  );
};

export default PostItem;
