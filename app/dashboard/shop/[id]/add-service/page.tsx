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
    <main className="min-h-screen bg-background">
      <Header user={user} />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">// SERVICE_REGISTRY : NEW_ENTRY</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Tambah Layanan<span className="text-primary">_</span></h1>
          <p className="mt-3 text-muted-foreground">Daftarkan layanan baru untuk {shop.name}</p>
        </div>

        <div className="max-w-2xl rounded-2xl border border-primary/30 bg-card/90 p-6 shadow-lg cyber-glow md:p-8">
          <AddServiceForm shopId={id} />
        </div>
      </div>
    </main>
  )
}
