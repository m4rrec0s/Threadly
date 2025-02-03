import Link from "next/link";

export function renderContentWithMention(content: string) {
  if (content.startsWith("@")) {
    const mention = content.split(" ")[0];
    const restOfContent = content.split(" ").slice(1).join(" ");
    return (
      <>
        <Link
          href={`/${mention.substring(1)}`}
          className="text-blue-600 px-1 py-0.5 rounded-md font-semibold hover:opacity-80"
        >
          {mention}
        </Link>
        {` ${restOfContent}`}
      </>
    );
  }
  return content;
}
