import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Users2 } from 'lucide-react'

const DashboardSidebar = () => {

  const items = [
    {
      title: "Players",
      
    }
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Player</SidebarGroupLabel> */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                a
                <Users2/>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default DashboardSidebar