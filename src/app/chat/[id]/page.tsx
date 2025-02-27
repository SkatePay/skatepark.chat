import Chat from "@/app/components/Chat"; // Import Chat component
import Link from "next/link"; // Import Next.js Link component

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Readonly<Props>) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Go Home
      </Link>
      {/* Chat Component */}
      <Chat channelId={id} />
    </div>
  );
}
