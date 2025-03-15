interface Props {
  input: string
  setInput: (value: string) => void
  onSend: () => void
  onHype: () => void
}

export default function MessageInput({ input, setInput, onSend, onHype }: Readonly<Props>) {
  return (
    <div className="mt-4 flex w-full gap-2">
      <input
        type="text"
        className="flex-grow rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700"
        onClick={onSend}
      >
        Send 🚀
      </button>

      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700"
        onClick={onHype}
      >
        Hype ✨
      </button>
    </div>
  )
}
