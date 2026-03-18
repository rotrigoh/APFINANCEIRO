import { NextResponse } from 'next/server';
import { getLatestDashboardIndicators } from '@/lib/api/bcb';

export const revalidate = 3600; // Cache de 1 hora no servidor

export async function GET() {
  try {
    const data = await getLatestDashboardIndicators();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na API de indicadores:", error);
    return NextResponse.json({ error: "Failed to fetch indicators" }, { status: 500 });
  }
}
