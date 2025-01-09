import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendIcon } from "lucide-react";
import { Post } from "../types/Posts";
import { User } from "../types/Users";
import { dateConvert } from "../helpers/dateConvert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface PostCommentsProps {
  post: Post;
  users: User[];
}

const PostComments: React.FC<PostCommentsProps> = ({ post, users }) => {
  return (
    <div>
      {post && post.comments && post.comments.length > 0 ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-0 hover:no-underline"
            >
              Ver todos os{" "}
              {post.comments.length +
                post.comments.reduce(
                  (acc, comment) =>
                    acc + (comment.answers ? comment.answers.length : 0),
                  0
                )}{" "}
              comentários
            </Button>
          </DialogTrigger>
          <DialogContent className="text-sm flex-grow">
            <DialogHeader className="hidden">
              <DialogTitle>Comentários</DialogTitle>
            </DialogHeader>
            <div>
              <div className="flex items-center space-x-2">
                {post.user && (
                  <Image
                    src={`${post.user.image}`}
                    alt="user image"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <p>
                    <span className="font-semibold text-base">
                      {post.user.username}
                    </span>{" "}
                    {post.content}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {dateConvert(post.created_at)}
              </span>
            </div>

            <div className="border-b border-gray-600"></div>

            {post.comments.map((comment) => {
              const userComment = users.find(
                (user) => user.id === comment.author_id
              );

              return (
                <div key={comment.id}>
                  <div className="mt-3 flex items-center space-x-2">
                    <Image
                      src={`${userComment?.image}`}
                      alt="user image"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <p>
                        <span className="font-semibold text-base">
                          {userComment?.username}
                        </span>{" "}
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {dateConvert(comment.created_at)}
                        </span>
                        <Button
                          variant={"link"}
                          className="p-0 hover:no-underline"
                        >
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>

                  {comment.answers &&
                    comment.answers.map((answer) => {
                      const userAnswers = users.find(
                        (user) => user.id === answer.author_id
                      );
                      return (
                        <div
                          key={answer.id}
                          className="mt-3 flex items-center space-x-2"
                        >
                          <Image
                            src={`${userAnswers?.image}`}
                            alt="user image"
                            width={30}
                            height={30}
                            className="rounded-full"
                          />
                          <div className="flex flex-col">
                            <p>
                              <span className="font-semibold text-base">
                                {userAnswers?.username}
                              </span>{" "}
                              {answer.content}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {dateConvert(answer.created_at)}
                              </span>
                              <Button
                                variant={"link"}
                                className="p-0 hover:no-underline"
                              >
                                Responder
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
            {post.comments.length === 0 && (
              <div className="w-full mt-2 text-center">
                <h3 className="text-sm text-gray-400">
                  Ainda não há nenhum comentário
                </h3>
              </div>
            )}

            <form className="mt-3 flex gap-3 items-center">
              <Input
                type="text"
                placeholder="Adicione um comentário..."
                className=""
              />
              <Button className="text-sm px-2 font-semibold">
                <SendIcon className="!w-5 !h-5" />
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}
      <div>
        <div className="mt-3 flex gap-3 items-center">
          <Input
            type="text"
            placeholder="Adicione um comentário..."
            className=""
          />
          <Button className="text-sm px-2 font-semibold">
            <SendIcon className="!w-5 !h-5" />
          </Button>
        </div>
      </div>
      <div className="border-b border-gray-600 py-2"></div>
    </div>
  );
};

export default PostComments;
