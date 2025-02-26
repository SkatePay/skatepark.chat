import Chat from "@/app/components/Chat"; // Import Chat component
import Link from "next/link"; // Import Next.js Link component

interface ChannelPageProps {
  params: { id: string };
}

const ChatPage = ({ params }: ChannelPageProps) => {
  const { id } = params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Go Home
      </Link>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Skate Connect Chat #{id}
      </h1>

      {/* Chat Component */}
      <Chat />
    </div>
  );
};

export default ChatPage;
