import RecipeSidebar from "../../components/app-sidebar"
import { ChartAreaInteractive } from "../../components/chart-area-interactive"
import { DataTable } from "../../components/data-table"
import { SectionCards } from "../../components/section-cards"
import { SiteHeader } from "../../components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "../../components/ui/sidebar"
import Layout from "../../pages/Layout"


  
export default function Page() {

  return (
     <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <RecipeSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Layout />
      </main>
    </div>  
  )
}
