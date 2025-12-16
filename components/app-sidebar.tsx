import { Calendar, Home, Landmark, MapPinHouse, Shapes, BrainCog, Shield, UserStar} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin/",
    icon: Home,
  },
  {
    title: "Eventos",
    url: "/admin/evento",
    icon: Calendar,
  },
  {
    title: "Salas",
    url: "/admin/salas",
    icon: MapPinHouse,
  },
  {
    title: "Tipo de evento",
    url: "/admin/tipo",
    icon: Shapes,
  },
  {
    title: "Ciclo",
    url: "/admin/ciclo",
    icon: BrainCog,
  },
  {
    title: "Clasificacion",
    url: "/admin/clasificacion",
    icon: Shield,
  },
  {
    title: "Participantes",
    url: "/admin/participantes",
    icon: UserStar,
  },
  {
    title: "Expositores",
    url: "/admin/expositores",
    icon: Landmark,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
