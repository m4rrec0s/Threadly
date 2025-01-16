import { Post } from "../types/Posts";
import { User } from "../types/Users";
import { dateConvert } from "../helpers/dateConvert";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import Image from "next/image";

interface PostItemProps {
  post: Post;
  users: User[];
}

const PostItem: React.FC<PostItemProps> = ({ post, users }) => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Link href={`/${post.user.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`${post.user.image}` || "/usuario-sem-foto-de-perfil.jpg"}
              alt={"user image - " + post.user.id}
            />
            <AvatarFallback>
              <div className="flex-grow bg-slate-500 animate-pulse"></div>
            </AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/${post.user.username}`}>
          <h3 className="font-normal text-base">{post.user.username}</h3>
        </Link>
      </div>

      <div className="mt-3">
        <div className="relative w-[468px] h-[585px]">
          <Image
            src={`http://localhost:8080/uploads/${post.images[0].url}`}
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
