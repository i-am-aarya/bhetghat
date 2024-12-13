import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useAuth } from '@/context/auth-context'
import { Bell, ChevronsUpDown, LogOut, Settings2 } from 'lucide-react'

const SidebarUser = () => {
  const { user, logout } = useAuth()
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg">{user?.firstName[0]}{user?.lastName[0]}</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.firstName} {user?.lastName}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align='end'
            sideOffset={4}
          >

            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">{user?.firstName[0]}{user?.lastName[0]}</AvatarFallback>

                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.firstName} {user?.lastName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings2 />
                Account
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log Out
            </DropdownMenuItem>


          </DropdownMenuContent>

        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default SidebarUser