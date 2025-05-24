'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Send } from 'lucide-react'

interface Message {
  id: string
  content: string
  timestamp: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  isMe: boolean
}

interface ChatDetail {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  messages: Message[]
}

// Mock data
const mockChat: ChatDetail = {
  id: '1',
  name: 'Team Chat',
  status: 'online',
  messages: [
    {
      id: '1',
      content: 'Hey team, how\'s everyone doing?',
      timestamp: '10:00 AM',
      sender: { id: '1', name: 'John' },
      isMe: false
    },
    {
      id: '2',
      content: 'Working on the new features!',
      timestamp: '10:05 AM',
      sender: { id: '2', name: 'You' },
      isMe: true
    },
    {
      id: '3',
      content: 'Great progress so far. Let\'s sync up later.',
      timestamp: '10:10 AM',
      sender: { id: '1', name: 'John' },
      isMe: false
    }
  ]
}

export default function ChatPage() {
  const params = useParams()
  const [chat, setChat] = useState<ChatDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadChat = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setChat(mockChat)
      setLoading(false)
    }
    loadChat()
  }, [])

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chat?.messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chat) return

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: { id: 'me', name: 'You' },
      isMe: true
    }

    setChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMsg]
    } : null)
    setNewMessage('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="border-b p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[60px]" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!chat) return null

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <div className="h-full w-full rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium">
                {chat.name[0]}
              </div>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                chat.status === 'online'
                  ? 'bg-green-500'
                  : chat.status === 'away'
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{chat.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{chat.status}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div className="space-y-6 max-w-3xl mx-auto">
          {chat.messages.map((message, index) => (
            <div key={message.id}>
              {index > 0 && (
                <Separator className="my-6" />
              )}
              <div
                className={`flex items-start space-x-4 ${
                  message.isMe ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <div className="h-full w-full rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium text-sm">
                    {message.sender.name[0]}
                  </div>
                </Avatar>
                <div className={`flex flex-col ${message.isMe ? 'items-end' : ''}`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.sender.name}
                    </span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <div
                    className={`mt-1 rounded-lg px-4 py-2 max-w-md ${
                      message.isMe
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4 bg-white">
        <div className="flex space-x-4 max-w-3xl mx-auto">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
