export interface SGSData {
  data: string;
  valor: string;
}

const SGS_CODES = {
  SELIC_META: 432, // Meta Selic atual
  SELIC_DIARIA: 11,
  IPCA: 433, // IPCA Variacao mensal
  IGPM: 189, // IGP-M Variacao mensal
  INCC: 192, // INCC Variacao mensal
  TR: 226, // TR Variacao mensal
  POUPANCA: 195, // Rendimento da Poupança
};

export async function fetchSGSValue(codigo: number, limit: number = 1): Promise<SGSData[]> {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados/ultimos/${limit}?formato=json`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });
    
    if (!res.ok) {
      throw new Error(`Erro ao buscar dados do BCB (código ${codigo})`);
    }
    
    const data: SGSData[] = await res.json();
    return data;
  } catch (error) {
    console.error(`Fetch SGS error [${codigo}]:`, error);
    return [];
  }
}

// Helpers específicos para o Dashboard
export async function getLatestDashboardIndicators() {
  const [selic, ipca, igpm, incc] = await Promise.all([
    fetchSGSValue(SGS_CODES.SELIC_META, 1),
    fetchSGSValue(SGS_CODES.IPCA, 12),
    fetchSGSValue(SGS_CODES.IGPM, 12),
    fetchSGSValue(SGS_CODES.INCC, 12),
  ]);

  // Calcula o acumulado de 12 meses somando ou multiplicando, dependendo de como a API devolve (normalmente devolvem variação em % mensal)
  const calcAcumulado = (series: SGSData[]) => {
    if (!series || series.length === 0) return "N/A";
    const acumulado = series.reduce((acc, curr) => {
      const val = parseFloat(curr.valor) / 100;
      return acc * (1 + val);
    }, 1);
    return ((acumulado - 1) * 100).toFixed(2);
  };

  return {
    selic: selic?.[0]?.valor ? parseFloat(selic[0].valor).toFixed(2) : "N/A",
    ipca12m: calcAcumulado(ipca),
    igpm12m: calcAcumulado(igpm),
    incc12m: calcAcumulado(incc),
    dataReferencia: ipca?.[ipca.length - 1]?.data || "N/A",
    history: {
      ipca: ipca.map(item => ({ data: item.data, valor: parseFloat(item.valor) })),
      igpm: igpm.map(item => ({ data: item.data, valor: parseFloat(item.valor) })),
      incc: incc.map(item => ({ data: item.data, valor: parseFloat(item.valor) })),
    }
  };
}
