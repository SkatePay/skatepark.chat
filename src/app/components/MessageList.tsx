import { forwardRef, useEffect } from 'react'
import { Message } from '@/app/hooks/useWebsocket'
import timeFromNow from '../helpers/timeFromNow'

interface Props {
  messages: Message[]
}

const MessageList = forwardRef<HTMLDivElement, Props>(({ messages }, ref) => {
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [messages]) // Auto-scroll when messages update

  return (
    <div
      ref={ref}
      className="custom-scrollbar h-64 w-full space-y-2 overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 shadow-inner dark:border-gray-700 dark:bg-gray-800"
    >
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages yet...</p>
      ) : (
        messages.map(({ content, pubkey, created_at }: Message) => {
          if (!content) return null

          // Attempt to parse JSON content
          let parsedContent
          try {
            parsedContent = JSON.parse(content)
          } catch (error) {
            console.warn('Invalid JSON in message content:', error, content)
            return null
          }

          const { content: text } = parsedContent || {}
          if (!text) return null

          const isOwnMessage =
            pubkey === 'a8c4cbd4edd1d31aebc9e9822d336ab47a97e3490a3c4d2377f5d280c9922dd0'

          return (
            <div
              key={created_at}
              className={`max-w-[80%] whitespace-pre-wrap break-words rounded-lg p-2 text-sm ${
                isOwnMessage
                  ? 'ml-auto self-end bg-blue-500 text-white'
                  : 'self-start bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
              }`}
              style={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              <strong>{pubkey ? pubkey.slice(0, 3) : 'N/A'}:</strong> {text}
              <br />
              <span className="text-xs text-gray-400">{timeFromNow(created_at * 1000)}</span>
            </div>
          )
        })
      )}
    </div>
  )
})

// ✅ Add display name for better debugging
MessageList.displayName = 'MessageList'

export default MessageList
