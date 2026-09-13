import { NextResponse } from "next/server";

/**
 * Health check do serviço: GET /api
 */
export async function GET() {
  return NextResponse.json({
    app: "ludus",
    status: "ok",
    time: new Date().toISOString(),
  });
}
