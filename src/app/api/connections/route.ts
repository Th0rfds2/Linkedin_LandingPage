import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { peopleSuggestions } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const personId = Number((raw as Record<string, unknown> | null)?.personId);
  if (!Number.isInteger(personId) || personId <= 0) {
    return Response.json({ error: "Pessoa inválida." }, { status: 400 });
  }

  const [updated] = await db
    .update(peopleSuggestions)
    .set({ connected: sql`not ${peopleSuggestions.connected}` })
    .where(eq(peopleSuggestions.id, personId))
    .returning();

  if (!updated) {
    return Response.json({ error: "Pessoa não encontrada." }, { status: 404 });
  }

  return Response.json({ connected: updated.connected });
}
