import { createClient } from '@/lib/supabase/server'
import Header from '@/components/header'
import ShopCard from '@/components/shop-card'

export default async function ShopsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: shops, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_open', true)
    .order('rating', { ascending: false })

  return (
    <main className="min-h-screen bg-white">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">All Shops</h1>
          <p className="text-lg text-gray-600 mt-2">Browse all available phone repair services</p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load shops</p>
          </div>
        ) : !shops || shops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No shops available yet</p>
            <p className="text-gray-500">Check back soon for phone repair services</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
