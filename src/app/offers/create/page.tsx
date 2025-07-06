import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import CreateOfferForm from '@/components/offers/CreateOfferForm'

export const metadata: Metadata = {
  title: 'Create Offer - Confianza',
  description: 'Create a new trading offer',
}

export default async function CreateOfferPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Trading Offer</h1>
        <p className="mt-2 text-gray-600">
          Set up your crypto trading offer for other users to discover
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <CreateOfferForm />
      </div>
    </div>
  )
}