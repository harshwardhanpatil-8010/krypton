'use client'
import { LayoutDashboard, Refrigerator, PanelTopClose, ArrowRightLeft, Send, FolderSync, ScanLine, SatelliteDish, User2, ChevronUp } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Sell", 
    url: "/dashboard/sell",
    icon: PanelTopClose,
  },
  {
    title: "Buy",
    url: "/dashboard/buy", 
    icon: ScanLine,
  },
  {
    title: "Swap",
    url: "/dashboard/swap",
    icon: ArrowRightLeft,
  },
  {
    title: "Receive",
    url: "/dashboard/receive",
    icon: SatelliteDish,
  },
  {
    title: "Transfer",
    url: "/dashboard/transfer",
    icon: FolderSync,
  },
]

export function AppSidebar() {

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/login", { method: "GET" });
      if (response.ok) {
        window.location.href = "/login"; 
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/data", {
          credentials: "include",
        });  
        if (!res.ok) {
          console.error("Unauthorized or error fetching data");
          return;
        }
        const json = await res.json();
        setUser(json.user);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className="bg-krypton-600">
    <Sidebar >
      <SidebarContent className="p-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-4xl text-white font-bold mt-2 tracking-tighter mb-12 justify-center select-none">
         <h1 className="select-none"> KRYPTON</h1>  
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-4 text-gray-400 font-medium cursor-pointer hover:text-white">
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg  group "
                        >
                      <item.icon className="w-5 h-5 text-gray-100 " />
                      <span className="text-gray-400 font-medium cursor-pointer hover:text-white">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                  
                </SidebarMenuItem>
              ))}
              
            </SidebarMenu>
          </SidebarGroupContent>
          
        </SidebarGroup>
       
      </SidebarContent>
      <Separator className="my-4 border-2" />
      <div className="mb-4">
      <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                  <User2 className="mr-2" />
                  {user?.username || "Loading..."}
                    <ChevronUp className="ml-auto h-24" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <span className="cursor-pointer">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
    </Sidebar>
    </div>
  )
}
