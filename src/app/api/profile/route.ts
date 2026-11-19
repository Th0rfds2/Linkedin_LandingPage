import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { getPrimaryProfile } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

function readText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength + 1);
}

export async function GET() {
  await ensureSeeded();
  const profile = await getPrimaryProfile();
  return Response.json(profile);
}

export async function PATCH(request: Request) {
  await ensureSeeded();

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  if (!raw || typeof raw !== "object") {
    return Response.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const body = raw as Record<string, unknown>;
  const name = readText(body.name, 80);
  const headline = readText(body.headline, 160);
  const location = readText(body.location, 80);
  const about = readText(body.about, 2000);
  const pronouns = readText(body.pronouns, 30);

  if (name.length < 2) {
    return Response.json({ error: "Informe um nome com pelo menos 2 caracteres." }, { status: 400 });
  }
  if (headline.length < 2) {
    return Response.json({ error: "Informe um título profissional válido." }, { status: 400 });
  }
  if (location.length < 2) {
    return Response.json({ error: "Informe um local válido." }, { status: 400 });
  }
  if (about.length < 10 || about.length > 2000) {
    return Response.json(
      { error: "A seção Sobre deve ter entre 10 e 2000 caracteres." },
      { status: 400 },
    );
  }

  const profile = await getPrimaryProfile();
  const [updated] = await db
    .update(profiles)
    .set({
      name,
      headline,
      location,
      about,
      pronouns: pronouns || null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profile.id))
    .returning();

  return Response.json(updated);
}
