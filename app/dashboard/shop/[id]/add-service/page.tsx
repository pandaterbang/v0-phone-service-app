import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Header from '@/components/header'
import AddServiceForm from '@/components/add-service-form'

export default async function AddServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: shop } = await supabase.from('shops').select('*').eq('id', id).eq('user_id', user.id).single()

  if (!shop) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Add Service</h1>
          <p className="text-gray-600 mt-2">to {shop.name}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl">
          <AddServiceForm shopId={params.id} />
        </div>
      </div>
    </main>
  )
}
