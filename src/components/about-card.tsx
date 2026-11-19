"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { EditProfileButton } from "@/components/profile-ui";
import { SectionCard } from "@/components/ui";
import { cn } from "@/lib/cn";

export function AboutCard({ about }: { about: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = about.length > 320;

  return (
    <SectionCard
      title="Sobre"
      actions={
        <EditProfileButton className="li-icon-btn" label="Editar seção Sobre">
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </EditProfileButton>
      }
    >
      <p
        className={cn(
          "li-body-text whitespace-pre-line",
          !expanded && isLong && "line-clamp-3-custom",
        )}
      >
        {about}
      </p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-1 rounded-sm text-sm font-semibold text-ink-muted hover:text-linkedin hover:underline"
        >
          {expanded ? "ver menos" : "...ver mais"}
        </button>
      ) : null}
    </SectionCard>
  );
}
