'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Search } from 'lucide-react'
import Link from 'next/link'

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatarUrl?: string
  unreadCount?: number
  status?: 'online' | 'offline' | 'away'
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Team Chat',
    lastMessage: 'Let\'s discuss the new features',
    timestamp: '2m ago',
    unreadCount: 3,
    status: 'online'
  },
  {
    id: '2',
    name: 'Project Discussion',
    lastMessage: 'The deadline is next week',
    timestamp: '1h ago',
    status: 'away'
  },
  {
    id: '3',
    name: 'General',
    lastMessage: 'Good morning everyone!',
    timestamp: '3h ago',
    unreadCount: 1,
    status: 'online'
  },
  {
    id: '4',
    name: 'Design Team',
    lastMessage: 'Check out the new mockups',
    timestamp: '1d ago',
    status: 'offline'
  },
  {
    id: '5',
    name: 'Development Team',
    lastMessage: 'PR is ready for review',
    timestamp: '1d ago',
    status: 'online'
  }
]

export default function MessagesPage() {
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setChats(mockChats)
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <Command className="rounded-lg border shadow-sm">
          <CommandInput placeholder="Search all messages..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[400px]">
                {loading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border-b last:border-0">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gray-300" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                      </div>
                      <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ))
                ) : (
                  filteredChats.map((chat) => (
                    <CommandItem
                      key={chat.id}
                      value={chat.name}
                      className="px-4 py-3 cursor-pointer"
                    >
                      <Link
                        href={`/messages/${chat.id}`}
                        className="flex items-center space-x-4 w-full"
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border border-gray-100">
                            <div className="h-full w-full rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium">
                              {chat.name[0]}
                            </div>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                              chat.status
                            )}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{chat.name}</p>
                            <span className="text-xs text-gray-500">{chat.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unreadCount ? (
                          <Badge variant="secondary" className="ml-2">
                            {chat.unreadCount}
                          </Badge>
                        ) : null}
                      </Link>
                    </CommandItem>
                  ))
                )}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  )
}
