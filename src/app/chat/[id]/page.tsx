import Chat from "@/app/components/Chat"; // Import Chat component
import Footer from "@/app/components/Footer";
import Link from "next/link"; // Import Next.js Link component

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Readonly<Props>) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Chat channelId={id} />
      <Footer />
    </div>
  );
}
