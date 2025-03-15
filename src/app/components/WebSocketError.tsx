interface Props {
  error: string
  onRetry: () => void
}

export default function WebSocketError({ error, onRetry }: Readonly<Props>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-center dark:bg-gray-900">
      <h1 className="text-xl font-semibold text-red-500">⚠️ Connection Error</h1>
      <p className="mt-2 text-gray-700 dark:text-gray-300">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700"
      >
        Retry 🔄
      </button>
    </div>
  )
}
