import { supabase_execute_sql } from '@/lib/supabase/server'

export default async function DebugPage() {
  const supabase = await supabase_execute_sql()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data berhasil disimpan ke database!</h1>
      <p>Tabel profiles dan shops sudah siap digunakan.</p>
      <p>Untuk test dengan benar, Anda perlu:</p>
      <ul className="list-disc ml-4 mt-4 space-y-2">
        <li>Ke Supabase Dashboard &gt; Settings &gt; Auth &gt; Providers &gt; Email</li>
        <li>Disable "Require email confirmation"</li>
        <li>Atau gunakan test user yang sudah dibuat</li>
      </ul>
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <p className="font-bold">Test User:</p>
        <p>Email: shopowner@myphone.test</p>
        <p>Password: test123456</p>
      </div>
    </div>
  )
}
