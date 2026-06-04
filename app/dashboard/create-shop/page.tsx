import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/header'
import CreateShopForm from '@/components/create-shop-form'

export default async function CreateShopPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <main className="min-h-screen bg-white">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Create Your Shop</h1>
          <p className="text-gray-600 mt-2">Add your phone repair shop to the marketplace</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl">
          <CreateShopForm user={user} />
        </div>
      </div>
    </main>
  )
}
