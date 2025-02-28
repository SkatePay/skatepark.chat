import ChannelPage from "./ChannelPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Readonly<Props>) {
  const { id } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "https://api.skatepark.chat";

  const response = await fetch(`${baseUrl}/channel/${id}`);
  const data = await response.json();

  // Filter videos on the server side
  const filteredVideos =
    data.videos?.filter((video: { tags?: [string, string][] }) =>
      video.tags?.some((tag) => tag[0] === "t" && tag[1] === "video")
    ) ?? [];

  return <ChannelPage id={id} videos={filteredVideos} />;
}
