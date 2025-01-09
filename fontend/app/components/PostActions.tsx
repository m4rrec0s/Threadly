import { Button } from "./ui/button";
import { HeartIcon, MessageCircle, Send } from "lucide-react";
import { Post } from "../types/Posts";
import { User } from "../types/Users";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface PostActionsProps {
  post: Post;
  users: User[];
}

const PostActions: React.FC<PostActionsProps> = ({ post, users }) => {
  return (
    <div className="flex flex-col mt-1">
      <div className="space-x-4">
        <Button
          variant="link"
          className="hover:text-red-500 px-0 hover:no-underline"
        >
          <HeartIcon className="!w-5 !h-5" />
        </Button>
        <Button
          variant="link"
          className="hover:text-blue-500 px-0 hover:no-underline"
        >
          <MessageCircle className="!w-5 !h-5" />
        </Button>
        <Button
          variant="link"
          className="hover:text-green-500 px-0 hover:no-underline"
        >
          <Send className="!w-5 !h-5" />
        </Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          {Array.isArray(post.likes) && post.likes.length > 0 ? (
            <Button
              variant="link"
              className="text-sm font-semibold text-gray-400 hover:opacity-55 px-0 hover:no-underline transition-all"
            >
              <div className="w-full flex items-center space-x-2">
                {post.likes && post.likes.length > 0 ? (
                  <div className="flex -space-x-2">
                    {post.likes.slice(0, 3).map((like, index) => {
                      const user = users.find(
                        (user) => user.id === like.user_id
                      );
                      return (
                        <Image
                          key={index}
                          src={`${user?.image}`}
                          alt="user image"
                          width={20}
                          height={20}
                          className="rounded-full border-2 border-black"
                          style={{ zIndex: 3 - index }}
                        />
                      );
                    })}
                  </div>
                ) : null}
                <span>
                  {post.likes.length > 1
                    ? `${post.likes.length} curtidas`
                    : `${post.likes.length} curtida`}
                </span>
              </div>
            </Button>
          ) : null}
        </DialogTrigger>
        <DialogContent className="px-0 max-w-[300px] max-h-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">Curtidas</DialogTitle>
          </DialogHeader>
          <div className=" border-t-[0.5px] border-gray-600 border-separate"></div>
          <div className="flex flex-col space-y-3 h-full overflow-y-auto max-h-[300px] px-2">
            {post.likes
              ? post.likes.map((like) => {
                  const user = users.find((user) => user.id === like.user_id);
                  return (
                    <div
                      key={like.id}
                      className="flex items-center space-x-3 py-2 hover:bg-white/10 transition-all rounded-lg"
                    >
                      <Image
                        src={`${user?.image}`}
                        alt="user image"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <p className="font-semibold">{user?.username}</p>
                    </div>
                  );
                })
              : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostActions;
