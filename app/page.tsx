import PostsList from "./components/postsList";

export default function Home() {
  return (
    <main className="flex flex-col w-screen h-screen">
      <header className="p-5 border-b border-gray-700">
        <h1 className="text-xl font-extrabold">Threadly</h1>
      </header>
      <PostsList />
    </main>
  );
}
