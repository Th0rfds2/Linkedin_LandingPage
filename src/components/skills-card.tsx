"use client";

import { useState } from "react";
import { Check, Pencil, Plus, ThumbsUp } from "lucide-react";

import { AddSectionButton, EditProfileButton } from "@/components/profile-ui";
import { SectionCard } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

type SkillItem = {
  id: number;
  name: string;
  endorsements: number;
  endorsedByMe: boolean;
};

const INITIAL_VISIBLE = 6;

export function SkillsCard({ skills }: { skills: SkillItem[] }) {
  const [items, setItems] = useState(skills);
  const [expanded, setExpanded] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const visible = expanded ? items : items.slice(0, INITIAL_VISIBLE);

  const handleEndorse = async (skillId: number) => {
    setPendingId(skillId);
    try {
      const response = await fetch("/api/skills/endorse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as {
        endorsed: boolean;
        endorsements: number;
      };
      setItems((current) =>
        current.map((item) =>
          item.id === skillId
            ? { ...item, endorsedByMe: data.endorsed, endorsements: data.endorsements }
            : item,
        ),
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <SectionCard
      id="competencias"
      title="Competências"
      actions={
        <>
          <AddSectionButton className="li-icon-btn" label="Adicionar competência">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </AddSectionButton>
          <EditProfileButton className="li-icon-btn" label="Editar competências">
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </EditProfileButton>
        </>
      }
      bodyClassName="pt-1"
    >
      <ul className="divide-y divide-hairline">
        {visible.map((skill) => (
          <li key={skill.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-base font-semibold text-ink">{skill.name}</p>
              <p className="text-xs text-ink-muted">
                {formatNumber(skill.endorsements)} endossos
                {skill.endorsedByMe ? " · você endossou" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleEndorse(skill.id)}
              disabled={pendingId === skill.id}
              aria-pressed={skill.endorsedByMe}
              className={cn(
                "li-btn h-8 shrink-0 px-3 text-[13px]",
                skill.endorsedByMe ? "li-btn-soft text-linkedin" : "li-btn-outline-muted",
              )}
            >
              {skill.endorsedByMe ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" /> Endossado
                </>
              ) : (
                <>
                  <ThumbsUp className="h-4 w-4" aria-hidden="true" /> Endossar
                </>
              )}
            </button>
          </li>
        ))}
      </ul>

      {items.length > INITIAL_VISIBLE ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded py-2 text-sm font-semibold text-ink-muted hover:bg-surface-hover hover:text-ink"
        >
          {expanded ? "Mostrar menos" : `Mostrar todas as ${items.length} competências`}
        </button>
      ) : null}
    </SectionCard>
  );
}
