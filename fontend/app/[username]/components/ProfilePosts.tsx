import Image from "next/image";
import { LayoutGridIcon } from "lucide-react";
import { Post } from "@/app/types/Posts";
import { Button } from "@/app/components/ui/button";

interface ProfilePostsProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
}

export default function ProfilePosts({
  posts,
  onPostClick,
}: ProfilePostsProps) {
  const handlePostClick = (postId: string) => {
    onPostClick(postId);
  };

  return (
    <>
      <div className="flex justify-center w-full items-center gap-3">
        <LayoutGridIcon className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Publicações</h3>
      </div>
      <div className="w-full grid grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Button
              key={post.id}
              asChild
              onClick={() => handlePostClick(post.id)}
            >
              <div className="w-full h-0 pb-[100%] relative cursor-pointer">
                <Image
                  src={`http://localhost:8080/uploads/${post.images[0].url}`}
                  alt={post.content}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </Button>
          ))
        ) : (
          <div className="flex items-center justify-center w-full flex-grow">
            <h3 className="text-lg text-center">
              Nenhuma publicação encontrada
            </h3>
          </div>
        )}
      </div>
    </>
  );
}
