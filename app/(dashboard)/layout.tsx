import { Navbar } from '@/components/layout/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617]">
      <Navbar />
      <main className="bg-gray-50 dark:bg-[#020617]">{children}</main>
    </div>
  )
}

