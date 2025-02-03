import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { User } from "@/app/types/Users";
import { Comment } from "@/app/types/Comments";

interface CommentWithUser extends Comment {
  user: User | null;
}

const CommentSection = ({
  comments,
  handleReply,
  handleDeleteComment,
  user,
  dateConvert,
}: {
  comments: CommentWithUser[];
  handleReply: (commentId: string, usr: User) => void;
  handleDeleteComment: (commentId: string) => void;
  user: User | null;
  dateConvert: (date: string) => string;
}) => {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4">
          <div className="flex items-center justify-between">
            <div className="mt-3 flex items-center space-x-2">
              {comment.user?.image ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`http://localhost:8080/uploads/avatar/${comment.user?.image}`}
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
                    {comment.user?.username}
                  </span>{" "}
                  {comment.content}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {dateConvert(comment.created_at)}
                  </span>
                  <Button
                    variant={"link"}
                    className="p-0 hover:no-underline text-gray-500"
                    onClick={() =>
                      comment.user && handleReply(comment.id, comment.user)
                    }
                  >
                    Responder
                  </Button>
                </div>
              </div>
            </div>
            {user?.id === comment.author_id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MoreVerticalIcon size={30} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {comment.answers.map((answer) => (
            <div
              key={answer.id}
              className="ml-8 mt-3 flex items-center space-x-2"
            >
              {answer.user?.image ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={`http://localhost:8080/uploads/avatar/${answer.user?.image}`}
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
                    {answer.user?.username}
                  </span>{" "}
                  {answer.content.startsWith("@") ? (
                    <>
                      <Link
                        href={`/${answer.content.split(" ")[0].substring(1)}`}
                        className="text-blue-600 px-1 py-0.5 rounded-md font-semibold hover:opacity-80"
                      >
                        {answer.content.split(" ")[0]}
                      </Link>
                      {` ${answer.content.split(" ").slice(1).join(" ")}`}
                    </>
                  ) : (
                    answer.content
                  )}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {dateConvert(answer.created_at)}
                  </span>
                  <Button
                    variant={"link"}
                    className="p-0 hover:no-underline text-gray-500 "
                    onClick={() =>
                      answer.user && handleReply(comment.id, answer.user)
                    }
                  >
                    Responder
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      {comments.length === 0 && (
        <div className="w-full mt-2 text-center">
          <h3 className="text-sm text-gray-400">
            Ainda não há nenhum comentário
          </h3>
        </div>
      )}
    </>
  );
};

export default CommentSection;
