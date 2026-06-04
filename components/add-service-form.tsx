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
    const data = {
      shop_id: shopId,
      name: formData.get('name'),
      category: formData.get('category'),
      brand: formData.get('brand') || null,
      price: parseInt(formData.get('price') as string),
      description: formData.get('description') || null,
    }

    try {
      const { error: insertError } = await supabase.from('repair_services').insert([data])

      if (insertError) throw insertError

      router.push(`/dashboard/shop/${shopId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Service Name *</label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., iPhone Screen Replacement"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Category *</label>
          <select
            name="category"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-900 mb-2">Brand</label>
          <select
            name="brand"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <label className="block text-sm font-medium text-gray-900 mb-2">Price (Rp) *</label>
        <input
          type="number"
          name="price"
          required
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="50000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
        <textarea
          name="description"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe this service in detail"
        />
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="flex gap-4">
        <Link
          href={`/dashboard/shop/${shopId}`}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Service'}
        </button>
      </div>
    </form>
  )
}
