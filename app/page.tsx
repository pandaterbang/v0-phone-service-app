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
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,oklch(0.76_0.2_320_/_0.12),transparent_32%),radial-gradient(circle_at_15%_40%,oklch(0.82_0.17_190_/_0.1),transparent_28%)]" />

        <div className="container relative mx-auto px-4 py-16">
          <div className="mb-14 max-w-3xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">// LOCAL_REPAIR_NETWORK : ONLINE</p>
            <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight text-balance text-foreground md:text-7xl">
              Temukan teknisi HP terpercaya di sekitar kamu<span className="text-primary">_</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Akses jaringan servis lokal dengan teknisi terverifikasi, harga transparan, dan jalur komunikasi langsung.
            </p>
          </div>
          <ShopGrid />
        </div>
      </div>
    </main>
  )
}
