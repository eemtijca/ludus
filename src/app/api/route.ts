import { NextResponse } from "next/server";

/**
 * Health check — para a equipe da escola verificar o serviço:
 *   GET /api/health
 */
export async function GET() {
  return NextResponse.json({
    app: "ludus-jogos-ensino-medio",
    status: "ok",
    games: 12,
    time: new Date().toISOString(),
  });
}
