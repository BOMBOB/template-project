'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Plus, Users } from 'lucide-react'
import Link from 'next/link'

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatarUrl?: string
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Team Chat',
    lastMessage: 'Let\'s discuss the new features',
    timestamp: '2m ago'
  },
  {
    id: '2',
    name: 'Project Discussion',
    lastMessage: 'The deadline is next week',
    timestamp: '1h ago'
  },
  {
    id: '3',
    name: 'General',
    lastMessage: 'Good morning everyone!',
    timestamp: '3h ago'
  }
]

const quickActions = [
  {
    title: 'New Chat',
    icon: <MessageSquare className="h-4 w-4" />,
    href: '/messages/new',
    color: 'secondary'
  },
  {
    title: 'Join Group',
    icon: <Users className="h-4 w-4" />,
    href: '/groups',
    color: 'secondary'
  },
  {
    title: 'Create Group',
    icon: <Plus className="h-4 w-4" />,
    href: '/groups/new',
    color: 'secondary'
  }
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setChats(mockChats)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="bg-white border shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="w-full justify-start h-10 bg-gray-50 hover:bg-gray-100 transition-colors"
                  asChild
                >
                  <Link href={action.href}>
                    {action.icon}
                    <span className="ml-3 font-medium">{action.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Chats */}
        <Card className="md:col-span-2 border shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900">Recent Chats</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {loading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[160px]" />
                    </div>
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                ))
              ) : (
                // Loaded state
                chats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/messages/${chat.id}`}
                    className="flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <div className="h-full w-full rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-white font-medium text-lg">
                        {chat.name[0]}
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{chat.name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 tabular-nums">{chat.timestamp}</span>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
