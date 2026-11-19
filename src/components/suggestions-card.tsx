"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, UserPlus, X } from "lucide-react";

import { cn } from "@/lib/cn";

type Person = {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string;
  mutualConnections: number;
  connected: boolean;
};

const INITIAL_VISIBLE = 3;

export function SuggestionsCard({ people }: { people: Person[] }) {
  const [items, setItems] = useState(people);
  const [expanded, setExpanded] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState<number[]>([]);

  const available = items.filter((person) => !dismissed.includes(person.id));
  const visible = expanded ? available : available.slice(0, INITIAL_VISIBLE);

  const toggleConnection = async (personId: number) => {
    setPendingId(personId);
    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as { connected: boolean };
      setItems((current) =>
        current.map((person) =>
          person.id === personId ? { ...person, connected: data.connected } : person,
        ),
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section id="pessoas" aria-label="Pessoas que talvez você conheça" className="li-card scroll-mt-28">
      <div className="flex items-start justify-between gap-2 px-4 pt-4">
        <h2 className="text-base font-semibold text-ink">Pessoas que talvez você conheça</h2>
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="li-link shrink-0 text-sm"
        >
          {expanded ? "Ver menos" : "Ver todos"}
        </button>
      </div>

      <ul className="mt-1 divide-y divide-hairline">
        {visible.map((person) => (
          <li key={person.id} className="relative px-4 py-3">
            <button
              type="button"
              aria-label={`Dispensar sugestão de ${person.name}`}
              onClick={() => setDismissed((current) => [...current, person.id])}
              className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full text-ink-faint transition hover:bg-black/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <div className="flex gap-2.5 pr-5">
              <Image
                src={person.avatarUrl}
                alt={`Foto de ${person.name}`}
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm leading-tight font-semibold text-ink">{person.name}</p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-ink-muted">
                  {person.headline}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {person.mutualConnections} conexões em comum
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleConnection(person.id)}
              disabled={pendingId === person.id}
              className={cn(
                "li-btn mt-2 w-full",
                person.connected ? "li-btn-soft text-ink" : "li-btn-outline-muted",
              )}
            >
              {person.connected ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" /> Pendente
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" aria-hidden="true" /> Conectar
                </>
              )}
            </button>
          </li>
        ))}
      </ul>

      {available.length === 0 ? (
        <p className="px-4 pt-2 pb-4 text-sm text-ink-muted">
          Você viu todas as sugestões por hoje.
        </p>
      ) : null}
    </section>
  );
}
