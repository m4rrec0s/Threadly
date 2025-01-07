import Image from "next/image";
import { Post } from "../types/Posts";
import { User } from "../types/Users";
import { dateConvert } from "../helpers/dateConvert";
import PostActions from "./PostActions";
import PostComments from "./PostComments";

interface PostItemProps {
  post: Post;
  users: User[];
}

const PostItem: React.FC<PostItemProps> = ({ post, users }) => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Image
          src={`${post.user.image}?random=${post.user.id}`}
          alt="user image"
          width={30}
          height={30}
          className="rounded-full"
        />
        <h3 className="font-normal text-base">{post.user.username}</h3>
      </div>

      <div className="mt-3">
        <Image
          src={`${post.image_url}?random=${
            Math.floor(Math.random() * 100) + 1
          }`}
          alt={"post image " + post.id}
          width={500}
          height={500}
        />
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
