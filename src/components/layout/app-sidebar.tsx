import * as React from "react"
import Link from "next/link"
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Plus,
  LogOut,
  Settings,
  MoreHorizontal,
  LayoutDashboard,
  Star
} from "lucide-react"

import { mockUser } from "@/lib/mock-data"
import { getFavoriteCollections, getRecentCollections } from "@/lib/db/collections"
import { getItemTypes } from "@/lib/db/items"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarUser } from "@/components/layout/sidebar-user"
import { auth } from "@/auth"

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image: ImageIcon,
  Link: LinkIcon,
}

export async function AppSidebar() {
  const itemTypes = await getItemTypes()
  const favoriteCollections = await getFavoriteCollections()
  const recentCollections = await getRecentCollections(5)
  const session = await auth()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">DevStash</span>
                <span className="text-xs">Hub</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Types */}
        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemTypes.map((type) => {
                const Icon = iconMap[type.icon] || File
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton tooltip={type.name} render={<Link href={`/items/${type.name}`} />}>
                      <Icon style={{ color: type.color }} />
                      <span className="capitalize">{type.name}s</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Favorite Collections */}
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favoriteCollections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton tooltip={collection.name} render={<Link href={`/collections/${collection.id}`} />}>
                    <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="truncate">{collection.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Collections */}
        <SidebarGroup>
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentCollections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton tooltip={collection.name} render={<Link href={`/collections/${collection.id}`} />}>
                    <div className="h-3 w-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: collection.dominantColor || "var(--border)" }} />
                    <span className="truncate">{collection.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem className="mt-2">
                <SidebarMenuButton render={<Link href="/collections" />}>
                  <span className="text-muted-foreground text-sm font-medium">View all collections...</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Avatar */}
      <SidebarFooter>
        <SidebarUser user={{ name: session?.user?.name, email: session?.user?.email, image: session?.user?.image }} />
      </SidebarFooter>
    </Sidebar>
  )
}
