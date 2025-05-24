'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Search, UserPlus, Mail } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface Contact {
  id: string
  name: string
  email: string
  status: 'online' | 'offline' | 'away'
  avatar?: string
  lastSeen?: string
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'away',
    lastSeen: '5m ago'
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    status: 'offline',
    lastSeen: '2h ago'
  }
]

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email')
})

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  })

  useEffect(() => {
    const loadContacts = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setContacts(mockContacts)
      setLoading(false)
    }
    loadContacts()
  }, [])

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-400'
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      status: 'offline',
      lastSeen: 'Never'
    }
    setContacts(prev => [...prev, newContact])
    setDialogOpen(false)
    form.reset()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Add Contact</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  Add a new contact to your network. They will receive an invitation.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Add Contact
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] rounded-lg border bg-white shadow-sm">
          <div className="divide-y">
            {loading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              ))
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <div className="h-full w-full rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium">
                        {contact.name[0]}
                      </div>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        contact.status
                      )}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <Badge
                        variant={contact.status === 'online' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {contact.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    {contact.lastSeen && (
                      <p className="text-xs text-gray-500 mt-1">
                        {contact.lastSeen}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
