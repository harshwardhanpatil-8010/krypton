import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from '../_components/sidebar'
import { Separator } from '@/components/ui/separator'

function swap() {
  return (
      <SidebarProvider>
         
            <AppSidebar />
            <div className="flex-1 p-10">
              <SidebarTrigger className="md:hidden xl:hidden 2xl:hidden lg:hidden" />
              <h1 className="text-4xl text-white font-bold">Swap</h1>
                     <Separator className="my-4 border-2 " />
            </div>
       
        </SidebarProvider>
  )
}

export default swap