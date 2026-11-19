import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { skills } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const skillId = Number((raw as Record<string, unknown> | null)?.skillId);
  if (!Number.isInteger(skillId) || skillId <= 0) {
    return Response.json({ error: "Competência inválida." }, { status: 400 });
  }

  const [updated] = await db
    .update(skills)
    .set({
      endorsedByMe: sql`not ${skills.endorsedByMe}`,
      endorsements: sql`greatest(0, ${skills.endorsements} + case when ${skills.endorsedByMe} then -1 else 1 end)`,
    })
    .where(eq(skills.id, skillId))
    .returning();

  if (!updated) {
    return Response.json({ error: "Competência não encontrada." }, { status: 404 });
  }

  return Response.json({
    endorsed: updated.endorsedByMe,
    endorsements: updated.endorsements,
  });
}
