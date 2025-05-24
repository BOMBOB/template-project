'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Camera, CheckCircle2, AlertCircle } from 'lucide-react'

interface Profile {
  id: string
  name: string
  email: string
  bio: string
  avatar?: string
  role: string
  location: string
  timezone: string
}

const mockProfile: Profile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Software engineer passionate about building great user experiences.',
  role: 'Senior Developer',
  location: 'San Francisco, CA',
  timezone: 'PST'
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  role: z.string().min(2, 'Role is required'),
  location: z.string().min(2, 'Location is required'),
  timezone: z.string().min(2, 'Timezone is required')
})

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      role: '',
      location: '',
      timezone: ''
    }
  })

  useEffect(() => {
    const loadProfile = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProfile(mockProfile)
      setLoading(false)
      form.reset(mockProfile)
    }
    loadProfile()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfile({ ...profile!, ...values })
      setIsEditing(false)
      setAlert({
        type: 'success',
        message: 'Profile updated successfully!'
      })

      // Clear alert after 3 seconds
      setTimeout(() => setAlert(null), 3000)
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-8">
        {alert && (
          <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {alert.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <div className="h-full w-full rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-2xl font-medium">
                  {profile.name[0]}
                </div>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        disabled={!isEditing}
                      />
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
                      <Input
                        placeholder="Your email"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your role"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your location"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your timezone"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a short bio about yourself. Max 500 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <div className="flex items-center space-x-4">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    form.reset(profile)
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}
