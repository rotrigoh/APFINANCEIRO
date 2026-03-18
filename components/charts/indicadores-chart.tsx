"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";

interface HistoryData {
  data: string;
  valor: number;
}

interface IndicadoresChartProps {
  history?: {
    ipca: HistoryData[];
    igpm: HistoryData[];
    incc: HistoryData[];
  };
}

export function IndicadoresChart({ history }: IndicadoresChartProps) {
  const chartData = useMemo(() => {
    if (!history || !history.ipca) return [];
    
    // Mesclar os dados por data
    return history.ipca.map((ipcaItem, index) => ({
      name: ipcaItem.data,
      IPCA: ipcaItem.valor,
      "IGP-M": history.igpm[index]?.valor || 0,
      "INCC-M": history.incc[index]?.valor || 0,
    }));
  }, [history]);

  if (!history || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <span className="text-muted-foreground">Carregando dados do gráfico...</span>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIpca" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorIgpm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorIncc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              borderColor: "hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--card-foreground))"
            }}
            itemStyle={{ fontSize: 14 }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Area
            type="monotone"
            dataKey="IPCA"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIpca)"
          />
          <Area
            type="monotone"
            dataKey="IGP-M"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIgpm)"
          />
          <Area
            type="monotone"
            dataKey="INCC-M"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncc)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
