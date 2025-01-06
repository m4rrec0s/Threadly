import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  user: {
    name: string;
    username: string;
    image: string;
  };
}

const Header = ({ user }: HeaderProps) => {
  return (
    <header className="p-5 border-b border-gray-700 flex items-center justify-between">
      <h1 className="text-xl font-extrabold">Threadly</h1>
      <nav className="flex items-center space-x-5">
        <Link
          className="text-gray-500 hover:text-white transition-colors"
          href={"#"}
        >
          Feed
        </Link>
        <Link
          className="text-gray-500 hover:text-white transition-colors"
          href={"#"}
        >
          Search
        </Link>
        <Link
          className="text-gray-500 hover:text-white transition-colors"
          href={"#"}
        >
          Profile
        </Link>
        <Link href={`/${user.username}`}>
          <Image
            src={user.image}
            width={40}
            height={40}
            alt={`${user.name} avatar`}
            className="rounded-full"
            title={user.name}
          />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
