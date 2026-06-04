import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/header'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .eq('user_id', user.id)

  return (
    <main className="min-h-screen bg-white">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your phone repair shop</p>
          </div>
          <Link href="/dashboard/create-shop" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Create Shop
          </Link>
        </div>

        {shops && shops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Link key={shop.id} href={`/dashboard/shop/${shop.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{shop.address}</p>
                    </div>
                    <span className={`text-sm font-semibold ${shop.is_open ? 'text-green-600' : 'text-red-600'}`}>
                      {shop.is_open ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📞 {shop.phone}</p>
                    <p>⭐ {shop.rating.toFixed(1)} rating</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-blue-600 text-sm font-medium">Manage Shop →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">You haven&apos;t created a shop yet</p>
            <Link href="/dashboard/create-shop" className="text-blue-600 font-semibold hover:underline">
              Create your first shop →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
