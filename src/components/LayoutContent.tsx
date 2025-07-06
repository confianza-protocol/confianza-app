import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface LayoutContentProps {
  children: React.ReactNode
}

export default async function LayoutContent({ children }: LayoutContentProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar user={user} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  )
}