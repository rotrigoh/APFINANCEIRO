"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, AlertCircle, TrendingUp, Landmark, LineChart as LineChartIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const IPCAvsINCCChart = dynamic(() => import("@/components/charts/premium-charts").then(mod => mod.IPCAvsINCCChart), { ssr: false });
const SelicVsFinanciamentoChart = dynamic(() => import("@/components/charts/premium-charts").then(mod => mod.SelicVsFinanciamentoChart), { ssr: false });
const FipeZapChart = dynamic(() => import("@/components/charts/premium-charts").then(mod => mod.FipeZapChart), { ssr: false });

async function fetchIndicators() {
  const res = await fetch("/api/indicators");
  if (!res.ok) throw new Error("Failed parameters");
  return res.json();
}

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-indicators"],
    queryFn: fetchIndicators,
  });

  return (
    <div className="space-y-8 relative">

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col gap-3 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl heading-modern pb-1">
          Inteligência de Mercado
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Análise em tempo real dos indexadores, projeção imobiliária e cruzamento macroeconômico automatizado.
          {data?.dataReferencia && <span className="ml-2 text-xs opacity-60">• Base: {data.dataReferencia}</span>}
        </p>
      </motion.div>

      {isError && (
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-xl flex items-center gap-3 shadow-sm border border-destructive/20 relative z-10">
          <AlertCircle className="h-5 w-5" />
          Conexão falhou ao acessar SGS Banco Central. Tentando novamente em background.
        </div>
      )}

      {/* Grid de Cards Resumo Micro-interativos */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        <Card className="card-modern group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide">Selic Meta</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
              <Landmark className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-10 w-20 mb-1" /> : (
              <div className="flex items-center gap-2">
                <div className="text-3xl font-extrabold tracking-tight">{data?.selic}% <span className="text-sm text-foreground/50 font-medium">a.a</span></div>
                <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">↓ -0.25 p.p</div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Taxa Básica de Juros atual
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide">IPCA</CardTitle>
             <div className="p-2 bg-amber-500/10 rounded-full group-hover:bg-amber-500/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-10 w-20 mb-1" /> : (
              <div className="flex items-center gap-2">
                <div className="text-3xl font-extrabold tracking-tight">{data?.ipca12m}% <span className="text-sm text-foreground/50 font-medium">12m</span></div>
                <div className="px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/20">↑ +0.12%</div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Inflação oficial acumulada
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide">IGP-M</CardTitle>
             <div className="p-2 bg-rose-500/10 rounded-full group-hover:bg-rose-500/20 transition-colors">
              <LineChartIcon className="h-4 w-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-10 w-20 mb-1" /> : (
              <div className="flex items-center gap-2">
                <div className="text-3xl font-extrabold tracking-tight">{data?.igpm12m}% <span className="text-sm text-foreground/50 font-medium">12m</span></div>
                <div className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-bold border border-border">Estável</div>
              </div>
             )}
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Inflação de contratos e aluguéis
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide">INCC-M</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
              <Info className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-10 w-20 mb-1" /> : (
              <div className="flex items-center gap-2">
                <div className="text-3xl font-extrabold tracking-tight">{data?.incc12m}% <span className="text-sm text-foreground/50 font-medium">12m</span></div>
                <div className="px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/20">↑ +0.31%</div>
              </div>
             )}
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Custo Nacional da Construção
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 relative z-10 w-full mb-8">
        
        {/* Painel Gráfico Elegante */}
        <Card className="col-span-full md:col-span-4 lg:col-span-5 card-modern shadow-md">
           <CardHeader className="pb-2">
            <CardTitle className="text-xl">Telemetria de Indexadores</CardTitle>
            <CardDescription>
              Comparativo paramétrico entre as forças do segmento em 12 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-4">
            {isLoading ? (
              <Skeleton className="w-full h-[320px] rounded-xl" />
            ) : (
              <Tabs defaultValue="ipca-incc" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mx-4 mb-2 bg-muted/50 p-1">
                  <TabsTrigger value="ipca-incc" className="rounded-md">IPCA x Obra</TabsTrigger>
                  <TabsTrigger value="selic-fin" className="rounded-md">Juros x Crédito</TabsTrigger>
                  <TabsTrigger value="fipe" className="rounded-md">FipeZap (Venda)</TabsTrigger>
                </TabsList>
                <TabsContent value="ipca-incc" className="mt-0">
                  <IPCAvsINCCChart history={data?.history} />
                </TabsContent>
                <TabsContent value="selic-fin" className="mt-0">
                  <SelicVsFinanciamentoChart history={data?.history} selicAtual={data?.selic} />
                </TabsContent>
                <TabsContent value="fipe" className="mt-0">
                  <FipeZapChart history={data?.history} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-full md:col-span-3 lg:col-span-2 card-modern bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Inteligência Competitiva</CardTitle>
            <CardDescription>
              Processamento algorítmico do viés atual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-2 border-b border-primary/10 pb-5">
                <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Ponderação do Crédito</span>
                <span className="text-sm leading-relaxed text-foreground/90">
                  O patamar atual da Selic reflete o viés cauteloso em relação ao IPCA de <strong className="text-primary">{data?.ipca12m ?? '...'}%</strong>. Empréstimos mantêm funding engessado, exigindo liquidez dos compradores.
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Risco Contratual</span>
                <span className="text-sm leading-relaxed text-foreground/90">
                  Com o IGP-M estabilizado em <strong className="text-orange-500">{data?.igpm12m ?? '...'}%</strong>, os reajustes de aluguel permanecem sob <span className="font-semibold underline decoration-wavy decoration-orange-500/50 underline-offset-2">{parseFloat(data?.igpm12m || "0") > 4 ? "forte pressão contratual" : "baixa volatilidade de repasse"}</span>.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
