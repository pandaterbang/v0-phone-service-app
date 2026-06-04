'use client'

import Link from 'next/link'
import { Star, MapPin, Phone, MessageCircle } from 'lucide-react'

interface Shop {
  id: string
  name: string
  image_url: string | null
  address: string
  phone: string
  whatsapp: string
  rating: number
  is_open: boolean
}

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shop/${shop.id}`}>
      <div className="group relative h-full overflow-hidden rounded-xl border border-primary/10 bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary to-accent">
          {shop.image_url ? (
            <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl opacity-20">📱</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
        </div>

        <div className="relative p-5">
          <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">{shop.name}</h3>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(shop.rating) ? 'fill-accent text-accent' : 'text-primary/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">({shop.rating.toFixed(1)})</span>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground mb-5">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <p className="line-clamp-2 text-xs">{shop.address}</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
              <a href={`tel:${shop.phone}`} className="text-xs hover:text-primary transition-colors">
                {shop.phone}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 flex-shrink-0 text-primary" />
              <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noreferrer" className="text-xs hover:text-primary transition-colors">
                WhatsApp
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-primary/10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              shop.is_open 
                ? 'bg-accent/20 text-accent' 
                : 'bg-destructive/20 text-destructive'
            }`}>
              <div className={`w-2 h-2 rounded-full ${shop.is_open ? 'bg-accent' : 'bg-destructive'}`}></div>
              {shop.is_open ? 'Open' : 'Closed'}
            </div>
            <span className="text-primary text-xs font-bold group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
