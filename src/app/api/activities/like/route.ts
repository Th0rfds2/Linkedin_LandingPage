import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { activities } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const activityId = Number((raw as Record<string, unknown> | null)?.activityId);
  if (!Number.isInteger(activityId) || activityId <= 0) {
    return Response.json({ error: "Publicação inválida." }, { status: 400 });
  }

  const [updated] = await db
    .update(activities)
    .set({
      likedByMe: sql`not ${activities.likedByMe}`,
      likes: sql`greatest(0, ${activities.likes} + case when ${activities.likedByMe} then -1 else 1 end)`,
    })
    .where(eq(activities.id, activityId))
    .returning();

  if (!updated) {
    return Response.json({ error: "Publicação não encontrada." }, { status: 404 });
  }

  return Response.json({ liked: updated.likedByMe, likes: updated.likes });
}
