import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/header'
import ShopGrid from '@/components/shop-grid'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-background">
      <Header user={user} />
      <div className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-3xl opacity-50"></div>
        </div>

        <div className="container relative mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
              Temukan Toko Servis HP Terdekat
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse trusted phone repair services with certified technicians, transparent pricing, and fast turnaround times
            </p>
          </div>
          <ShopGrid />
        </div>
      </div>
    </main>
  )
}
