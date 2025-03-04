import Link from "next/link";

interface Channel {
  name: string;
  channelId: string;
}

interface Props {
  channels: Channel[];
  selectedChannel: string;
  onChange: (channelId: string) => void;
}

export default function ChannelSelector({
  channels,
  selectedChannel,
  onChange,
}: Readonly<Props>) {
  return (
    <div className="mb-4 w-full">
      <label
        htmlFor="channel"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Select Channel <Link href={`/channel/${selectedChannel}`}>🎥</Link>:
      </label>
      <select
        name="channel"
        value={selectedChannel}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        {channels.map((ch) => (
          <option key={ch.channelId} value={ch.channelId}>
            {ch.name}
          </option>
        ))}
      </select>
    </div>
  );
}
