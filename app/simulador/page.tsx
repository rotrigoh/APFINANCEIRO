"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Calculator, Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

async function fetchIndicators() {
  const res = await fetch("/api/indicators");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function SimuladorPage() {
  const { data } = useQuery({
    queryKey: ["dashboard-indicators"],
    queryFn: fetchIndicators,
  });

  const [valorAluguel, setValorAluguel] = useState("2500");
  const [indexador, setIndexador] = useState("igpm");
  
  const [valorImovel, setValorImovel] = useState("500000");
  const [entrada, setEntrada] = useState("100000");
  const [prazoAnos, setPrazoAnos] = useState("30");

  const [resultadoReajuste, setResultadoReajuste] = useState<null | number>(null);
  const [resultadoFinanciamento, setResultadoFinanciamento] = useState<null | { parcela: number, montante: number }>(null);

  const selicAtual = parseFloat(data?.selic || "10.5");
  const igpmAtual = parseFloat(data?.igpm12m || "0");
  const ipcaAtual = parseFloat(data?.ipca12m || "0");

  const handleSimularReajuste = () => {
    const valorNum = parseFloat(valorAluguel) || 0;
    const taxa = indexador === "igpm" ? igpmAtual : ipcaAtual;
    const reajustado = valorNum * (1 + (taxa / 100));
    setResultadoReajuste(reajustado);
  };

  const handleSimularFinanciamento = () => {
    // Cálculo modelo basico SAC ou PRICE aproximado usando Taxa Anual.
    // Usaremos formula Price para simplificar a prestacao Fixa
    const V = (parseFloat(valorImovel) || 0) - (parseFloat(entrada) || 0);
    const n = parseFloat(prazoAnos) || 1; // anos
    if (V <= 0) return setResultadoFinanciamento({ parcela: 0, montante: 0 });

    // Taxa de juros anual baseada na Selic (adicionando um spread fictício de bancário, ex: Selic + 2%)
    const taxaAnual = selicAtual + 2.0; 
    const taxaMensal = (Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1);
    const meses = n * 12;

    const parcelaPrice = V * (taxaMensal * Math.pow(1 + taxaMensal, meses)) / (Math.pow(1 + taxaMensal, meses) - 1);
    
    setResultadoFinanciamento({
      parcela: parcelaPrice,
      montante: parcelaPrice * meses
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl heading-modern pb-1">Simuladores</h1>
        <p className="text-muted-foreground">
          Ferramentas interativas utilizando os indicadores de mercado em tempo real.
        </p>
      </div>

      <Tabs defaultValue="reajuste" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="reajuste">Reajuste de Contratos</TabsTrigger>
          <TabsTrigger value="financiamento">Financiamento</TabsTrigger>
        </TabsList>
        
        {/* TAB 1: REAJUSTE DE ALUGUEL */}
        <TabsContent value="reajuste" className="mt-4">
          <Card className="card-modern relative">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Calculadora de Reajuste Anual</CardTitle>
                <CardDescription className="mt-1">
                  Atualize valores de aluguel ou contratos baseando-se no IGP-M ou IPCA acumulado de 12 meses.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 p-2 px-3 rounded-full border border-border/40">
                <Label htmlFor="advanced-switch" className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mr-1">Avançado</Label>
                <Switch id="advanced-switch" className="scale-75 origin-right data-[state=checked]:bg-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Atual (R$)</Label>
                  <Input 
                    id="valor" 
                    type="number" 
                    placeholder="2500" 
                    value={valorAluguel}
                    onChange={(e) => setValorAluguel(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="indexador">Índice</Label>
                  <Select value={indexador} onValueChange={(val) => setIndexador(val as string)}>
                    <SelectTrigger id="indexador">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="igpm">IGP-M ({data?.igpm12m ?? '--'}%)</SelectItem>
                      <SelectItem value="ipca">IPCA ({data?.ipca12m ?? '--'}%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button onClick={handleSimularReajuste} className="gap-2">
                <Calculator className="h-4 w-4" /> Calcular Reajuste
              </Button>
              
              {resultadoReajuste !== null && (
                <div className="w-full mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Valor Reajustado Projetado</p>
                  <p className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultadoReajuste)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Diferença de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultadoReajuste - parseFloat(valorAluguel))}
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* TAB 2: FINANCIAMENTO */}
        <TabsContent value="financiamento" className="mt-4">
          <Card className="card-modern relative">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Simulador de Financiamento</CardTitle>
                <CardDescription className="mt-1">
                  Simule parcelas pelo método PRICE projetando juros balizados pela Selic atual ({selicAtual}%).
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 p-2 px-3 rounded-full border border-border/40">
                <Label htmlFor="amort-switch" className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mr-1">Modo SAC</Label>
                <Switch id="amort-switch" className="scale-75 origin-right data-[state=checked]:bg-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="imovel">Valor do Imóvel (R$)</Label>
                  <Input 
                    id="imovel" 
                    type="number" 
                    value={valorImovel}
                    onChange={(e) => setValorImovel(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entrada">Entrada (R$)</Label>
                  <Input 
                    id="entrada" 
                    type="number" 
                    value={entrada}
                    onChange={(e) => setEntrada(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo (Anos)</Label>
                  <Input 
                    id="prazo" 
                    type="number" 
                    value={prazoAnos}
                    onChange={(e) => setPrazoAnos(e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button onClick={handleSimularFinanciamento} className="gap-2">
                <Calculator className="h-4 w-4" /> Simular Parcelas
              </Button>

              {resultadoFinanciamento !== null && (
                <div className="w-full mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Parcela Fixa (Aprox.)</p>
                      <p className="text-3xl font-bold text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultadoFinanciamento.parcela)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Montante Final a Pagar</p>
                      <p className="text-xl font-semibold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultadoFinanciamento.montante)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Custo Efetivo: Selic ({selicAtual}%) + Spread (2.0%) a.a</p>
                    </div>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
