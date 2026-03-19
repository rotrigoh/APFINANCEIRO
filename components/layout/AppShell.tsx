"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, TrendingUp, Newspaper, Calculator, FileText, Menu, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Indicadores", href: "/indicadores", icon: TrendingUp },
  { name: "Notícias", href: "/noticias", icon: Newspaper },
  { name: "Simulador", href: "/simulador", icon: Calculator },
  { name: "Relatórios", href: "/relatorios", icon: FileText },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setIsCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("sidebar-collapsed", newVal.toString());
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0 glass-panel border-r-0">
             <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl">
              <div className="flex h-16 items-center px-6 font-bold text-xl tracking-tight text-primary">
                APFinanceiro
              </div>
              <nav className="flex-1 space-y-2 px-4 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Sidebar Desktop CSS Animated */}
        <div
          className={cn(
            "hidden lg:flex lg:flex-col lg:inset-y-0 border-r bg-card/40 backdrop-blur-3xl relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out",
            isCollapsed ? "w-20" : "w-[260px]"
          )}
        >
          <div className={cn("flex h-20 shrink-0 items-center border-b border-border/50 transition-all overflow-hidden", isCollapsed ? "justify-center px-0" : "justify-between px-6")}>
            <div className={cn("transition-all duration-300 ease-in-out whitespace-nowrap", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
              <span className="font-extrabold text-2xl tracking-tighter text-primary">
                APFinanceiro.
              </span>
            </div>
            
            {isCollapsed && (
               <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-lg text-primary-foreground mx-auto shadow-md shadow-primary/20">
                 AP
               </div>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-3.5 top-24 h-7 w-7 rounded-full border shadow-sm bg-background hover:bg-accent hover:border-primary/50 z-50 text-muted-foreground hover:text-primary transition-all duration-300"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </Button>

          <nav className="flex flex-1 flex-col px-4 py-8 gap-2 overflow-x-hidden">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", !isActive && "group-hover:scale-110", isActive && "text-primary-foreground")} />
                  <span className={cn("whitespace-nowrap transition-all duration-300", isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto translate-y-[1px]")}>
                     {item.name}
                  </span>
                </Link>
              );

              return isCollapsed ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="font-semibold px-3 py-1.5 rounded-lg border-primary/20 bg-card text-foreground shadow-xl z-50">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <React.Fragment key={item.name}>{linkContent}</React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <header className="flex h-20 shrink-0 items-center justify-between border-b px-6 lg:px-8 bg-background/60 backdrop-blur-xl sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-4 w-full">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex relative w-full max-w-sm group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary z-10" />
                <Input
                  type="search"
                  placeholder="Pesquisar módulos ou relatórios..."
                  className="w-full bg-accent/40 hover:bg-accent/60 pl-10 h-10 border-transparent focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all rounded-full shadow-inner"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-gradient-to-br from-background via-background to-muted/20">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
