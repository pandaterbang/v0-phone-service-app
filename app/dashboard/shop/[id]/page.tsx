import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Header from '@/components/header'
import ManageShopForm from '@/components/manage-shop-form'

export default async function ManageShopPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: shop, error } = await supabase.from('shops').select('*').eq('id', params.id).eq('user_id', user.id).single()

  if (error || !shop) {
    notFound()
  }

  const { data: services } = await supabase
    .from('repair_services')
    .select('*')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-white">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Manage {shop.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shop Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shop Info</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Name</p>
                  <p className="text-gray-900">{shop.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Address</p>
                  <p className="text-gray-900">{shop.address}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Phone</p>
                  <p className="text-gray-900">{shop.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">WhatsApp</p>
                  <p className="text-gray-900">{shop.whatsapp}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Status</p>
                  <p className={`font-semibold ${shop.is_open ? 'text-green-600' : 'text-red-600'}`}>
                    {shop.is_open ? 'Open' : 'Closed'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Rating</p>
                  <p className="text-gray-900">⭐ {shop.rating.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Services</h2>
                <a
                  href={`/dashboard/shop/${shop.id}/add-service`}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Add Service
                </a>
              </div>

              {services && services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.category}</p>
                        {service.brand && <p className="text-sm text-gray-500">Brand: {service.brand}</p>}
                        {service.description && <p className="text-sm text-gray-700 mt-2">{service.description}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">Rp{service.price.toLocaleString('id-ID')}</p>
                        <div className="flex gap-2 mt-2">
                          <a
                            href={`/dashboard/shop/${shop.id}/edit-service/${service.id}`}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Edit
                          </a>
                          <form method="POST" className="inline">
                            <input type="hidden" name="serviceId" value={service.id} />
                            <button type="submit" formAction={`/dashboard/shop/${shop.id}/delete-service`} className="text-red-600 text-sm hover:underline">
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No services yet. Start by adding one!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
