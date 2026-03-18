"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Check, Monitor, Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PRESET_COLORS = [
  { name: "Blue", value: "221.2 83.2% 53.3%", hex: "#3b82f6" },
  { name: "Violet", value: "262.1 83.3% 57.8%", hex: "#8b5cf6" },
  { name: "Rose", value: "346.8 77.2% 49.8%", hex: "#f43f5e" },
  { name: "Orange", value: "24.6 95% 53.1%", hex: "#f97316" },
  { name: "Teal", value: "173.4 80.4% 40%", hex: "#14b8a6" },
  { name: "Green", value: "142.1 76.2% 36.3%", hex: "#22c55e" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(PRESET_COLORS[0].value);

  useEffect(() => {
    const saved = localStorage.getItem("app-primary-color");
    if (saved) {
      setCurrentColor(saved);
      document.documentElement.style.setProperty("--primary", saved);
      document.documentElement.style.setProperty("--ring", saved);
    }
  }, []);

  const handleSetColor = (hslValue: string) => {
    setCurrentColor(hslValue);
    localStorage.setItem("app-primary-color", hslValue);
    document.documentElement.style.setProperty("--primary", hslValue);
    document.documentElement.style.setProperty("--ring", hslValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* @ts-ignore */}
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="group rounded-full hover:bg-muted/50 transition-colors">
          <Settings className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 mt-2 p-5 rounded-2xl shadow-xl glass-panel">
        <div className="space-y-6">
          <div className="space-y-1.5 border-b pb-4">
            <h4 className="font-semibold tracking-tight text-foreground">Aparência do Sistema</h4>
            <p className="text-sm text-muted-foreground leading-snug">Personalize a paleta central e modo noturno.</p>
          </div>
          
          <div className="space-y-3">
            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Modo de Cor</Label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-muted/40 rounded-lg">
              <Button variant={theme === "light" ? "default" : "ghost"} onClick={() => setTheme("light")} className="w-full text-xs gap-2 rounded-md transition-all shadow-none">
                <Sun className="h-3.5 w-3.5" /> Light
              </Button>
              <Button variant={theme === "dark" ? "default" : "ghost"} onClick={() => setTheme("dark")} className="w-full text-xs gap-2 rounded-md transition-all shadow-none">
                <Moon className="h-3.5 w-3.5" /> Dark
              </Button>
              <Button variant={theme === "system" ? "default" : "ghost"} onClick={() => setTheme("system")} className="w-full text-xs gap-2 rounded-md transition-all shadow-none">
                <Monitor className="h-3.5 w-3.5" /> Auto
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Cor de Destaque</Label>
            <div className="flex gap-3 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSetColor(c.value)}
                  className={`relative flex items-center justify-center rounded-full h-8 w-8 transition-transform hover:scale-110 shadow-sm border border-black/10 dark:border-white/10 ${currentColor === c.value ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {currentColor === c.value && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Interface</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 px-3 bg-muted/40 rounded-lg border border-border/50">
                 <Label htmlFor="anim-switch" className="text-sm font-medium cursor-pointer">Animações Dinâmicas</Label>
                 <Switch id="anim-switch" defaultChecked className="scale-75 origin-right data-[state=checked]:bg-primary" />
              </div>
              <div className="flex items-center justify-between p-2 px-3 bg-muted/40 rounded-lg border border-border/50">
                 <Label htmlFor="compact-switch" className="text-sm font-medium cursor-pointer">Modo Compacto</Label>
                 <Switch id="compact-switch" className="scale-75 origin-right data-[state=checked]:bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
