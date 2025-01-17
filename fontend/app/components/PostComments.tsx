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
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PostCommentsProps {
  post: Post;
  users: User[];
  createComment: (postId: string, authorId: string, content: string) => void;
}

const PostComments: React.FC<PostCommentsProps> = ({
  post,
  users,
  createComment,
}) => {
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState("");

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim() && user) {
      createComment(post.id, user.id, commentContent);
      setCommentContent("");
    } else {
      console.log("Comentário vazio");
    }
  };

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
                {post.user &&
                  (post.user?.image !== "" ? (
                    <Avatar>
                      <AvatarImage
                        src={`http://localhost:8080/uploads/avatar/${post.user?.image}`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        <div className="flex-grow bg-slate-500 animate-pulse"></div>
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarImage src={"/usuario-sem-foto-de-perfil.jpg"} />
                      <AvatarFallback>
                        <div className="flex-grow bg-slate-500 animate-pulse"></div>
                      </AvatarFallback>
                    </Avatar>
                  ))}
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
                    {userComment?.image !== "" ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`http://localhost:8080/uploads/avatar/${userComment?.image}`}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          <div className="flex-grow bg-slate-500 animate-pulse"></div>
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={"/usuario-sem-foto-de-perfil.jpg"}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          <div className="flex-grow bg-slate-500 animate-pulse"></div>
                        </AvatarFallback>
                      </Avatar>
                    )}
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
                          {userAnswers?.image !== "" ? (
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={`http://localhost:8080/uploads/avatar/${userAnswers?.image}`}
                                className="object-cover"
                              />
                              <AvatarFallback>
                                <div className="flex-grow bg-slate-500 animate-pulse"></div>
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={"/usuario-sem-foto-de-perfil.jpg"}
                                className="object-cover"
                              />
                              <AvatarFallback>
                                <div className="flex-grow bg-slate-500 animate-pulse"></div>
                              </AvatarFallback>
                            </Avatar>
                          )}
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

            <form
              className="mt-3 flex gap-3 items-center"
              onSubmit={handleCreateComment}
            >
              <Input
                type="text"
                placeholder="Adicione um comentário..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <Button type="submit" className="text-sm px-2 font-semibold">
                <SendIcon className="!w-5 !h-5" />
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}
      <div>
        <form
          onSubmit={handleCreateComment}
          className="mt-3 flex gap-3 items-center"
        >
          <Input
            type="text"
            placeholder="Adicione um comentário..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button type="submit" className="text-sm px-2 font-semibold">
            <SendIcon className="!w-5 !h-5" />
          </Button>
        </form>
      </div>
      <div className="border-b border-gray-600 py-2"></div>
    </div>
  );
};

export default PostComments;
