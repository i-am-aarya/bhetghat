import MenuBar from '@/components/MenuBar'
import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedLayout>
      <SidebarProvider>
        <MenuBar/>
        <main>
          {children}
        </main>
      </SidebarProvider>
    </ProtectedLayout>
  )
}

export default layout