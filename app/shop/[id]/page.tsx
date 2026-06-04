import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/header'
import { MapPin, Phone, MessageCircle, Star } from 'lucide-react'

export default async function ShopPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: shop, error } = await supabase.from('shops').select('*').eq('id', params.id).single()

  if (error || !shop) {
    notFound()
  }

  const { data: services } = await supabase
    .from('repair_services')
    .select('*')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <main className="min-h-screen bg-white">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg h-64 mb-6 flex items-center justify-center overflow-hidden">
              {shop.image_url ? (
                <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-white text-6xl">📱</div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">{shop.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(shop.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg text-gray-600">
                {shop.rating.toFixed(1)} ({reviews?.length || 0} reviews)
              </span>
              <span className={`ml-4 font-semibold ${shop.is_open ? 'text-green-600' : 'text-red-600'}`}>
                {shop.is_open ? '🟢 Open' : '🔴 Closed'}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600">{shop.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <a href={`tel:${shop.phone}`} className="text-blue-600 hover:underline">
                    {shop.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <a
                    href={`https://wa.me/${shop.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Chat Now
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Services</h2>
              {services && services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <span className="text-lg font-bold text-blue-600">Rp{service.price.toLocaleString('id-ID')}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                      {service.brand && <p className="text-sm text-gray-500">Brand: {service.brand}</p>}
                      {service.description && <p className="text-sm text-gray-700 mt-2">{service.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No services listed yet</p>
              )}
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && <p className="text-gray-700">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sidebar - CTA */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact This Shop</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${shop.phone}`}
                  className="block w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition"
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${shop.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-green-700 transition"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
