import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { skills } from "@/db/schema";
import { getPrimaryProfile } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const name = typeof (raw as Record<string, unknown> | null)?.name === "string"
    ? ((raw as Record<string, unknown>).name as string).trim()
    : "";

  if (name.length < 2 || name.length > 60) {
    return Response.json(
      { error: "O nome da competência deve ter entre 2 e 60 caracteres." },
      { status: 400 },
    );
  }

  const profile = await getPrimaryProfile();

  const [duplicate] = await db
    .select({ id: skills.id })
    .from(skills)
    .where(
      sql`${skills.profileId} = ${profile.id} and lower(${skills.name}) = ${name.toLowerCase()}`,
    )
    .limit(1);

  if (duplicate) {
    return Response.json({ error: "Essa competência já está no seu perfil." }, { status: 409 });
  }

  const [last] = await db
    .select({ position: skills.position })
    .from(skills)
    .where(eq(skills.profileId, profile.id))
    .orderBy(desc(skills.position))
    .limit(1);

  const [created] = await db
    .insert(skills)
    .values({
      profileId: profile.id,
      name,
      position: (last?.position ?? 0) + 1,
    })
    .returning();

  return Response.json(created, { status: 201 });
}
