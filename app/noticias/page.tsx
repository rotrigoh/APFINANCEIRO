"use client";

import { useQuery } from "@tanstack/react-query";
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SpotlightCard as Card } from "@/components/ui/spotlight-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bot, AlertCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  categoria: string;
  resumoIA: string;
}

async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function NoticiasPage() {
  const { data: noticias, isLoading, isError } = useQuery({
    queryKey: ["news-feed"],
    queryFn: fetchNews,
  });

  const getBadgeColor = (cat: string) => {
    switch (cat) {
      case "juros": return "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20";
      case "inflação": return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20";
      case "construção": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
      case "crédito imobiliário": return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl heading-modern pb-1">Radar & Notícias</h1>
        <p className="text-muted-foreground">
          Acompanhe as últimas movimentações do mercado e os insights gerados por nossa Inteligência Artificial.
        </p>
      </div>

      {isError && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Não foi possível carregar o feed de notícias no momento.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="flex flex-col card-modern">
            <CardHeader className="space-y-2 pb-2">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </CardHeader>
            <CardContent className="flex-1">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}

        {!isLoading && noticias?.map((item) => (
          <Card key={item.id} className="flex flex-col card-modern group cursor-pointer">
            <CardHeader className="pb-3 flex-1">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={getBadgeColor(item.categoria)}>
                  {item.categoria.toUpperCase()}
                </Badge>
                {item.pubDate && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true, locale: ptBR })}
                  </span>
                )}
              </div>
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="line-clamp-3">
                  {item.title}
                </a>
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Fonte: {item.source}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="bg-muted/30 pt-4 pb-4 border-y">
              <div className="flex items-start gap-2">
                <Bot className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                  {item.resumoIA}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="pt-4 pb-4">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline w-full justify-end"
              >
                Ler matéria original <ExternalLink className="h-3 w-3" />
              </a>
            </CardFooter>
          </Card>
        ))}
        
        {!isLoading && noticias?.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg border-dashed">
             <p className="text-muted-foreground">Nenhuma notícia encontrada no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
