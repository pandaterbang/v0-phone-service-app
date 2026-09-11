'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  shopId: string
}

export default function AddServiceForm({ shopId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const category = String(formData.get('category') || '').trim()
    const price = Number(formData.get('price'))
    const brandValue = String(formData.get('brand') || '').trim()
    const descriptionValue = String(formData.get('description') || '').trim()

    if (!name || !category || !Number.isFinite(price) || price < 0) {
      setError('Lengkapi nama, kategori, dan harga layanan dengan benar.')
      setIsLoading(false)
      return
    }

    const data = {
      shop_id: shopId,
      name,
      category,
      brand: brandValue || null,
      price: Math.round(price),
      description: descriptionValue || null,
    }

    try {
      const { error: insertError } = await supabase.from('repair_services').insert(data)

      if (insertError) {
        console.error('[v0] Failed to insert repair service:', insertError)
        throw new Error(insertError.message)
      }

      router.push(`/dashboard/shop/${shopId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambahkan layanan. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Service Name *</label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-4 py-2 border border-primary/30 bg-input text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/70"
          placeholder="e.g., iPhone Screen Replacement"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
          <select
            name="category"
            required
            className="w-full px-4 py-2 border border-primary/30 bg-input text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/70"
          >
            <option value="">Select a category</option>
            <option value="Screen Repair">Screen Repair</option>
            <option value="Battery Replacement">Battery Replacement</option>
            <option value="Water Damage">Water Damage</option>
            <option value="Charging Port">Charging Port</option>
            <option value="Camera Repair">Camera Repair</option>
            <option value="Software">Software</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
          <select
            name="brand"
            className="w-full px-4 py-2 border border-primary/30 bg-input text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/70"
          >
            <option value="">Select a brand</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Oppo">Oppo</option>
            <option value="Vivo">Vivo</option>
            <option value="Google">Google</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Price (Rp) *</label>
        <input
          type="number"
          name="price"
          required
          min="0"
          className="w-full px-4 py-2 border border-primary/30 bg-input text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/70"
          placeholder="50000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
        <textarea
          name="description"
          rows={4}
          className="w-full px-4 py-2 border border-primary/30 bg-input text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/70"
          placeholder="Describe this service in detail"
        />
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/40 text-destructive px-4 py-3 rounded-lg">{error}</div>}

      <div className="flex gap-4">
        <Link
          href={`/dashboard/shop/${shopId}`}
          className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-foreground rounded-lg hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 cyber-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Service'}
        </button>
      </div>
    </form>
  )
}
