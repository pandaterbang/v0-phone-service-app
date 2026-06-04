import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/header'
import ShopGrid from '@/components/shop-grid'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-white">
      <Header user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Phone Repair Shops</h1>
          <p className="text-lg text-gray-600">Browse trusted phone repair services near you</p>
        </div>
        <ShopGrid />
      </div>
    </main>
  )
}
