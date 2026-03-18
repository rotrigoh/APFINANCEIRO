"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { IndicadoresChart } from "@/components/charts/indicadores-chart";
import { AlertCircle } from "lucide-react";

async function fetchIndicators() {
  const res = await fetch("/api/indicators");
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export default function IndicadoresPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-indicators"],
    queryFn: fetchIndicators,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Indicadores Detalhados</h1>
        <p className="text-muted-foreground">
          Análise aprofundada do IPCA, IGP-M e INCC-M nos últimos 12 meses.
        </p>
      </div>

      {isError && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Não foi possível carregar o histórico de indicadores do Banco Central.
        </div>
      )}

      {/* Gráfico Detalhado Maior */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Comparativo</CardTitle>
          <CardDescription>
            Crescimento percentual dos índices de precificação imobiliária.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 h-[400px]">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <IndicadoresChart history={data?.history} />
          )}
        </CardContent>
      </Card>

      {/* Tabela de Dados Livres */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Brutos Mês a Mês</CardTitle>
          <CardDescription>Variação mensal reportada (%)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data-Base</TableHead>
                    <TableHead className="text-right">IPCA</TableHead>
                    <TableHead className="text-right">IGP-M</TableHead>
                    <TableHead className="text-right">INCC-M</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.history?.ipca?.map((row: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.data}</TableCell>
                      <TableCell className="text-right">{row.valor}%</TableCell>
                      <TableCell className="text-right">{data.history.igpm[i]?.valor ?? "--"}%</TableCell>
                      <TableCell className="text-right">{data.history.incc[i]?.valor ?? "--"}%</TableCell>
                    </TableRow>
                  ))}
                  {!data?.history?.ipca?.length && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum dado encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
