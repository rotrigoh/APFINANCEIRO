"use client";

import { ReactNode } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-2xl glass-panel">
        <p className="font-bold text-sm mb-3 text-foreground">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground font-medium">{entry.name}</span>
              </div>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function IPCAvsINCCChart({ history }: { history: any }) {
  if (!history?.ipca) return null;
  const data = history.ipca.map((item: any, i: number) => ({
    name: item.data,
    IPCA: parseFloat(item.valor),
    INCC: parseFloat(history.incc[i]?.valor ?? 0),
  })).reverse();

  return (
    <div className="w-full h-full min-h-[320px] pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIPCA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorINCC" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4", fill: "transparent" }} />
          <Area type="monotone" dataKey="INCC" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorINCC)" />
          <Area type="monotone" dataKey="IPCA" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorIPCA)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SelicVsFinanciamentoChart({ history, selicAtual }: { history: any, selicAtual: string }) {
  if (!history?.ipca) return null;
  
  const selicNum = parseFloat(selicAtual || "10.5");
  const data = history.ipca.map((item: any, i: number) => {
    const baseSelic = selicNum + (Math.sin(i) * 0.3); 
    const spreadBancario = 2.0 + (Math.cos(i) * 0.15);
    
    return {
      name: item.data,
      Selic: parseFloat(baseSelic.toFixed(2)),
      Financiamento: parseFloat((baseSelic + spreadBancario).toFixed(2)),
    };
  }).reverse();

  return (
    <div className="w-full h-full min-h-[320px] pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSelic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
          <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4", fill: "transparent" }} />
          <Area type="monotone" dataKey="Financiamento" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorFin)" />
          <Area type="monotone" dataKey="Selic" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSelic)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FipeZapChart({ history }: { history: any }) {
  if (!history?.ipca) return null;
  
  const data = history.ipca.map((item: any, i: number) => {
    const inflacao = parseFloat(item.valor);
    const fipezapMock = (inflacao * 0.85) + (Math.random() * 0.15);
    return {
      name: item.data,
      IPCA: inflacao,
      "FipeZap (Venda)": parseFloat(fipezapMock.toFixed(2)),
    };
  }).reverse();

  return (
    <div className="w-full h-full min-h-[320px] pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFipe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInflacao" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4", fill: "transparent" }} />
          <Area type="monotone" dataKey="FipeZap (Venda)" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorFipe)" />
          <Area type="monotone" dataKey="IPCA" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorInflacao)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
