import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export const revalidate = 1800; // Cache de 30 minutos

// Simulador de IA basico para V1 sem API Keys
function simulateAIAssessment(title: string, contentSnippet: string) {
  const text = (title + " " + contentSnippet).toLowerCase();
  
  let categoria = "mercado";
  if (text.includes("selic") || text.includes("juros") || text.includes("copom")) categoria = "juros";
  else if (text.includes("ipca") || text.includes("igp-m") || text.includes("inflação")) categoria = "inflação";
  else if (text.includes("construção") || text.includes("incc") || text.includes("obra")) categoria = "construção";
  else if (text.includes("crédito") || text.includes("financiamento") || text.includes("caixa")) categoria = "crédito imobiliário";

  // Resumo simulado extraindo o core da noticia
  const resumoIA = contentSnippet 
    ? `Resumo gerado por IA: ${contentSnippet.split('. ')[0]}. O impacto esperado afeta principalmente o setor de ${categoria}.`
    : `Análise IA indisponível para esta manchete.`;

  return { categoria, resumoIA };
}

export async function GET() {
  try {
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=mercado+imobiliario+brasil+ou+selic+ou+financiamento+imobiliário&hl=pt-BR&gl=BR&ceid=BR:pt-419');
    
    const items = feed.items.slice(0, 12).map((item) => {
      const { categoria, resumoIA } = simulateAIAssessment(item.title || "", item.contentSnippet || item.content || "");
      return {
        id: item.guid,
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: item.source || "Google News",
        categoria,
        resumoIA
      };
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Erro na API de notícias:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
