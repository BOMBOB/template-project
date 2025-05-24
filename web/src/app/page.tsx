import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold">Welcome to your authenticated app!</h1>
        <p className="mt-3 text-2xl">
          You are signed in as: {user.email}
        </p>
        <button
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            'use server'
            const supabase = await createClient()
            await supabase.auth.signOut()
            redirect('/login')
          }}
        >
          Sign Out
        </button>
      </main>
    </div>
  )
}