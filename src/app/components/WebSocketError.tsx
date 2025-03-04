interface Props {
  error: string;
  onRetry: () => void;
}

export default function WebSocketError({ error, onRetry }: Readonly<Props>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-xl font-semibold text-red-500">
        ⚠️ Connection Error
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mt-2">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
      >
        Retry 🔄
      </button>
    </div>
  );
}
