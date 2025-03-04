interface Props {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onHype: () => void;
}

export default function MessageInput({
  input,
  setInput,
  onSend,
  onHype,
}: Readonly<Props>) {
  return (
    <div className="mt-4 flex w-full gap-2">
      <input
        type="text"
        className="flex-grow border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
        onClick={onSend}
      >
        Send 🚀
      </button>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
        onClick={onHype}
      >
        Hype ✨
      </button>
    </div>
  );
}
