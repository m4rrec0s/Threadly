import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { User } from "@/app/types/Users";
import Link from "next/link";
import { Skeleton } from "@/app/components/ui/skeleton";

interface ModalFollowingProps {
  users: Omit<User, "followers" | "following" | "posts">[];
  setIsModalFollowingOpen: (open: boolean) => void;
}

const ModalFollowing = ({
  users,
  setIsModalFollowingOpen,
}: ModalFollowingProps) => {
  return (
    <Dialog open onOpenChange={() => setIsModalFollowingOpen(false)}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle className="text-center py-2">Seguindo</DialogTitle>
        </DialogHeader>
        <ul className="flex flex-col gap-3 items-start w-[400px] h-[500px] overflow-y-auto p-5">
          {users.length === 0 ? (
            <Skeleton className="w-full h-10" />
          ) : (
            users.map((user) => (
              <li key={user.id} className="flex gap-3 items-center">
                {user.image !== "" ? (
                  <Avatar>
                    <AvatarImage
                      src={`http://localhost:8080/uploads/avatar/${user.image}`}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <div className="flex-grow bg-slate-500 animate-pulse"></div>
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarImage
                      src={"/usuario-sem-foto-de-perfil.jpg"}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <div className="flex-grow bg-slate-500 animate-pulse"></div>
                    </AvatarFallback>
                  </Avatar>
                )}
                <Link href={`/${user.username}`}>{user.username}</Link>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFollowing;
