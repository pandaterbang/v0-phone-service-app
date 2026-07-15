import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/header'
import { MapPin, Phone, MessageCircle, Star, Clock, AlertCircle } from 'lucide-react'

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
    <main className="min-h-screen bg-background">
      <Header user={user} />

      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
        {/* Decorative gradient blobs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-3xl opacity-50 pointer-events-none"></div>

        <div className="container relative mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Shop Header Image */}
            <div className="bg-gradient-to-br from-primary to-primary/60 rounded-2xl h-64 mb-6 flex items-center justify-center overflow-hidden shadow-lg relative group">
              {shop.image_url ? (
                <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="text-white text-6xl">📱</div>
              )}
            </div>

            {/* Shop Title and Rating */}
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-foreground mb-3">{shop.name}</h1>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(shop.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {shop.rating.toFixed(1)} 
                    <span className="text-muted-foreground ml-1">({reviews?.length || 0} ulasan)</span>
                  </span>
                </div>
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${shop.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${shop.is_open ? 'bg-green-700' : 'bg-red-700'}`}></span>
                  {shop.is_open ? 'Buka' : 'Tutup'}
                </div>
              </div>
            </div>

            {/* Shop Info Cards */}
            <div className="bg-card rounded-2xl p-6 mb-8 space-y-4 border border-primary/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                  <p className="text-foreground font-medium mt-1">{shop.address}</p>
                </div>
              </div>

              <div className="border-t border-primary/10 pt-4 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                  <a href={`tel:${shop.phone}`} className="text-primary hover:underline font-medium mt-1 inline-block">
                    {shop.phone}
                  </a>
                </div>
              </div>

              <div className="border-t border-primary/10 pt-4 flex items-start gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                  <a
                    href={`https://wa.me/${shop.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-600 hover:underline font-medium mt-1 inline-block"
                  >
                    Chat Sekarang
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">Layanan Tersedia</h2>
              {services && services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="group bg-card border border-primary/10 rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{service.name}</h3>
                          <p className="text-xs font-medium text-primary/70 mt-1 inline-block bg-primary/10 px-2 py-1 rounded">{service.category}</p>
                        </div>
                        <span className="text-lg font-bold text-primary whitespace-nowrap">Rp{(service.price || 0).toLocaleString('id-ID')}</span>
                      </div>
                      {service.brand && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Brand:</span> {service.brand}
                        </p>
                      )}
                      {service.description && <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl border border-primary/10">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">Belum ada layanan yang ditambahkan</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Ulasan Pelanggan</h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-card border border-primary/10 rounded-xl p-5 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-semibold text-primary ml-1">{review.rating}.0</span>
                      </div>
                      {review.comment && <p className="text-foreground leading-relaxed">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl border border-primary/10">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">Belum ada ulasan</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - CTA */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 sticky top-24 shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-5">Hubungi Toko</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${shop.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold py-4 px-4 rounded-xl hover:bg-primary/90 transition-all duration-200 active:scale-95"
                >
                  <Phone className="w-5 h-5" />
                  Telepon
                </a>
                <a
                  href={`https://wa.me/${shop.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-semibold py-4 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
