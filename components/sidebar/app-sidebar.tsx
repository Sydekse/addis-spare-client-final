"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  Package,
  ShoppingCart,
  Warehouse,
  BarChart,
  Star,
  Bell,
  HelpCircle,
  Settings,
  ShoppingBag,
  Truck,
  PlusCircle,
  BaggageClaim,
  Mail,
} from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const supplierMenuGroups: { label: string; items: MenuItem[] }[] = [
  {
    label: "Dashboard",
    items: [{ title: "Dashboard", url: "/supplier", icon: Home }],
  },
  {
    label: "Profile & Account",
    items: [{ title: "Profile", url: "/supplier/profile", icon: User }],
  },
  {
    label: "Inventory Management",
    items: [
      {
        title: "Add Product",
        url: "/supplier/products/new",
        icon: PlusCircle,
      },
      {
        title: "Products",
        url: "/supplier/products",
        icon: BaggageClaim,
      },
    ],
  },
  {
    label: "Order Management",
    items: [{ title: "Orders", url: "/supplier/orders", icon: ShoppingCart }],
  },
  {
    label: "Analytics & Reports",
    items: [
      { title: "Reports", url: "/supplier/reports", icon: BarChart },
      { title: "Reviews", url: "/supplier/reviews", icon: Star },
    ],
  },
  {
    label: "Support & Others",
    items: [
      { title: "Messages", url: "/supplier/messages", icon: HelpCircle },
      { title: "Settings", url: "/supplier/settings", icon: Settings },
    ],
  },
];
const adminMenuGroups: { label: string; items: MenuItem[] }[] = [
  {
    label: "Dashboard",
    items: [{ title: "Dashboard", url: "/admin", icon: Home }],
  },
  {
    label: "Management",
    items: [
      { title: "Users", url: "/admin/users", icon: User },
      { title: "Suppliers", url: "/admin/suppliers", icon: Truck },
      { title: "Products", url: "/admin/products", icon: Package },
      // { title: "Categories", url: "/admin/categories", icon: LayoutGrid },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
      { title: "Inventory", url: "/admin/inventory", icon: Warehouse },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Reports", url: "/admin/reports", icon: BarChart },
      { title: "Reviews", url: "/admin/reviews", icon: Star },
    ],
  },
  {
    label: "Other",
    items: [
      { title: "Notifications", url: "/admin/notifications", icon: Bell },
      { title: "Messages", url: "/admin/messages", icon: Mail },
      { title: "Support", url: "/admin/support", icon: HelpCircle },
      { title: "Profile", url: "/admin/profile", icon: User },
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const collapsed = false;

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BarChart className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Admin Portal</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-background border-r">
        {adminMenuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={collapsed ? item.title : undefined}
                      >
                        <a
                          href={item.url}
                          className={`flex items-center gap-2 transition-colors duration-200 ${
                            isActive
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "hover:bg-accent hover:text-accent-foreground"
                          } ${collapsed ? "justify-center" : ""}`}
                        >
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}

export function SupplierSidebar() {
  const pathname = usePathname();
  const collapsed = false;
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/supplier/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ShoppingBag className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Supplier Portal</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-background border-r">
        {supplierMenuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={collapsed ? item.title : undefined}
                      >
                        <a
                          href={item.url}
                          className={`flex items-center gap-2 transition-colors duration-200 ${
                            isActive
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "hover:bg-accent hover:text-accent-foreground"
                          } ${collapsed ? "justify-center" : ""}`}
                        >
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
