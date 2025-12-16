import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {Toaster} from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="">
        <SidebarTrigger className="fixed top-1.5" />
        {children}
      </main>
      <Toaster richColors />
    </SidebarProvider>
  );
}
