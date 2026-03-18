"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer, AlertCircle } from "lucide-react";

async function fetchIndicators() {
  const res = await fetch("/api/indicators");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function RelatoriosPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-indicators"],
    queryFn: fetchIndicators,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!data?.history?.ipca) return;
    
    // Header
    let csv = "Data,IPCA (%),IGP-M (%),INCC-M (%)\n";
    
    // Linhas
    data.history.ipca.forEach((item: any, i: number) => {
      const igpm = data.history.igpm[i]?.valor ?? "";
      const incc = data.history.incc[i]?.valor ?? "";
      csv += `${item.data},${item.valor},${igpm},${incc}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_indicadores_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:max-w-full">
      <div className="flex flex-col gap-2 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios e Exportação</h1>
        <p className="text-muted-foreground">
          Gere arquivos em formato CSV ou imprima nativamente (PDF) o resumo executivo atual.
        </p>
      </div>

      {isError && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2 print:hidden">
          <AlertCircle className="h-4 w-4" />
          Não foi possível carregar os dados para gerar o relatório.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 print:hidden">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5"/> Exportar Dados Brutos</CardTitle>
            <CardDescription>Baixe a série histórica dos últimos 12 meses em CSV (compatível com Excel).</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 text-sm text-muted-foreground">
            Recomendado para análises profundas ou cruzamento interativo em planilhas customizadas.
          </CardContent>
          <CardFooter>
            <Button onClick={handleExportCSV} disabled={isLoading || !data} className="w-full gap-2 font-semibold">
              <Download className="h-4 w-4" /> Baixar CSV
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Printer className="h-5 w-5"/> Imprimir Resumo Exxecutivo</CardTitle>
            <CardDescription>Gere um PDF ou imprima com visual formatado para papel contendo a síntese atual.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 text-sm text-muted-foreground">
            Gera um relatório sintético e profissional perfeito para apresentações ou reuniões táticas.
          </CardContent>
          <CardFooter>
            <Button onClick={handlePrint} disabled={isLoading || !data} variant="secondary" className="w-full gap-2 font-semibold border-2 border-primary/20 hover:border-primary/50">
              <Printer className="h-4 w-4" /> Gerar PDF / Imprimir
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* View de Impressão e Preview */}
      <div className="mt-12 bg-card border rounded-lg p-8 print:block print:p-0 print:border-none print:shadow-none shadow-sm">
        <div className="flex justify-between items-end border-b pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">APFinanceiro</h2>
            <p className="text-muted-foreground">Resumo Executivo do Mercado Imobiliário</p>
          </div>
          <p className="text-sm font-medium bg-muted px-3 py-1 rounded-md print:bg-transparent print:p-0">Data-Base: {data?.dataReferencia || "..."}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 print:grid-cols-4">
          <div className="bg-muted/30 p-4 rounded-lg print:border print:bg-transparent">
             <p className="text-sm text-muted-foreground font-medium mb-1">Taxa Selic Anual</p>
             <p className="text-2xl font-bold text-primary">{data?.selic || "--"}%</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg print:border print:bg-transparent">
             <p className="text-sm text-muted-foreground font-medium mb-1">IPCA (12 meses)</p>
             <p className="text-2xl font-bold text-foreground">{data?.ipca12m || "--"}%</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg print:border print:bg-transparent">
             <p className="text-sm text-muted-foreground font-medium mb-1">IGP-M (12 meses)</p>
             <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{data?.igpm12m || "--"}%</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg print:border print:bg-transparent">
             <p className="text-sm text-muted-foreground font-medium mb-1">INCC-M (12 meses)</p>
             <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{data?.incc12m || "--"}%</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Síntese de Cenário Sistêmica</h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            No acumulado de 12 meses finalizado em <strong>{data?.dataReferencia || "..."}</strong>, observamos o IPCA fechando em <strong>{data?.ipca12m || "..."}%</strong>, enquanto os índices atrelados à construção e mercado imobiliário variaram acentuadamente. O IGP-M registrou <strong>{data?.igpm12m || "..."}%</strong> e o INCC-M atingiu a marca de <strong>{data?.incc12m || "..."}%</strong>. A taxa básica de juros (Selic) está formatada em <strong>{data?.selic || "..."}%</strong>, determinando o piso para as taxas de financiamento dos próximos trimestres.
          </p>
          
          <div className="mt-8 pt-8">
             <h4 className="font-semibold text-sm mb-2">Comentário IA Preliminar</h4>
             <p className="text-sm bg-muted/50 p-4 rounded-lg italic print:border print:bg-transparent">
                "O desalinhamento entre o custo de construção (INCC) e o indicador oficial de inflação (IPCA) continua exigindo ajustes finos nos orçamentos de novos empreendimentos, enquanto a taxa Selic em patamar elevado mantém os custos de funding restritivos."
             </p>
          </div>

          <p className="text-xs text-muted-foreground mt-8 pt-6 border-t text-center">
            Relatório gerado automatizadamente por APFinanceiro &bull; Fonte de Dados: Banco Central do Brasil.
          </p>
        </div>
      </div>
    </div>
  );
}
