import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Header from '@/components/header'
import { Edit2, Plus, Trash2, MapPin, Phone, MessageCircle, Star, AlertCircle } from 'lucide-react'

export default async function ManageShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: shop, error } = await supabase.from('shops').select('*').eq('id', id).eq('user_id', user.id).single()

  if (error || !shop) {
    notFound()
  }

  const { data: services } = await supabase
    .from('repair_services')
    .select('*')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Kelola {shop.name}</h1>
          <p className="text-muted-foreground">Manage layanan dan informasi toko Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shop Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-6">Informasi Toko</h2>
              <div className="space-y-5">
                <div className="border-b border-primary/10 pb-4">
                  <p className="text-xs font-semibold text-primary uppercase">Nama Toko</p>
                  <p className="text-foreground font-semibold mt-2">{shop.name}</p>
                </div>
                
                <div className="border-b border-primary/10 pb-4 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-primary uppercase">Alamat</p>
                    <p className="text-foreground font-medium mt-2 text-sm">{shop.address}</p>
                  </div>
                </div>

                <div className="border-b border-primary/10 pb-4 flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-primary uppercase">Telepon</p>
                    <p className="text-foreground font-medium mt-2 text-sm">{shop.phone}</p>
                  </div>
                </div>

                <div className="border-b border-primary/10 pb-4 flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-green-600 uppercase">WhatsApp</p>
                    <p className="text-foreground font-medium mt-2 text-sm">{shop.whatsapp}</p>
                  </div>
                </div>

                <div className="border-b border-primary/10 pb-4">
                  <p className="text-xs font-semibold text-primary uppercase">Status</p>
                  <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${shop.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <span className={`w-2 h-2 rounded-full ${shop.is_open ? 'bg-green-700' : 'bg-red-700'}`}></span>
                    {shop.is_open ? 'Buka' : 'Tutup'}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-primary uppercase">Rating</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(shop.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-foreground font-bold">{shop.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-primary/10 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Layanan</h2>
                <a
                  href={`/dashboard/shop/${shop.id}/add-service`}
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-all duration-200 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Layanan
                </a>
              </div>

              {services && services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="group bg-gradient-to-r from-card to-card hover:from-primary/5 hover:to-accent/5 border border-primary/10 hover:border-primary/30 rounded-xl p-5 transition-all duration-300">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{service.name}</h3>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{service.category}</span>
                            {service.brand && <span className="text-xs text-muted-foreground">Brand: {service.brand}</span>}
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-primary whitespace-nowrap">Rp{(service.price || 0).toLocaleString('id-ID')}</span>
                      </div>

                      {service.description && (
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.description}</p>
                      )}

                      <div className="flex items-center gap-2 pt-4 border-t border-primary/10">
                        <a
                          href={`/dashboard/shop/${shop.id}/edit-service/${service.id}`}
                          className="inline-flex items-center gap-2 text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </a>
                        <form method="POST" className="inline">
                          <input type="hidden" name="serviceId" value={service.id} />
                          <button 
                            type="submit" 
                            formAction={`/dashboard/shop/${shop.id}/delete-service`} 
                            className="inline-flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                            onClick={(e) => {
                              if (!confirm('Hapus layanan ini?')) {
                                e.preventDefault()
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-primary/5 border border-primary/10 rounded-xl">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground font-medium mb-4">Belum ada layanan yang ditambahkan</p>
                  <a
                    href={`/dashboard/shop/${shop.id}/add-service`}
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Mulai Tambah Layanan
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
