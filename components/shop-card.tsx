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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          {shop.image_url ? (
            <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white text-4xl">📱</div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{shop.name}</h3>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(shop.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({shop.rating.toFixed(1)})</span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2">{shop.address}</p>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href={`tel:${shop.phone}`} className="hover:text-blue-600">
                {shop.phone}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-blue-600">
                WhatsApp
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className={`text-sm font-medium ${shop.is_open ? 'text-green-600' : 'text-red-600'}`}>
              {shop.is_open ? 'Open' : 'Closed'}
            </span>
            <span className="text-blue-600 text-sm font-medium">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
