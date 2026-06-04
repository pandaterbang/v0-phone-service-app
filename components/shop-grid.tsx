import { createClient } from '@/lib/supabase/server'
import ShopCard from './shop-card'

export default async function ShopGrid() {
  const supabase = await createClient()

  const { data: shops, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_open', true)
    .order('rating', { ascending: false })

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load shops</p>
      </div>
    )
  }

  if (!shops || shops.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No shops available yet</p>
        <p className="text-gray-500">Check back soon for phone repair services</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  )
}
