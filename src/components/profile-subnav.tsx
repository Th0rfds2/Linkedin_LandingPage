"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { cn } from "@/lib/cn";

const TABS = [
  { id: "top", label: "Perfil" },
  { id: "atividades", label: "Atividades" },
  { id: "experiencia", label: "Experiência" },
  { id: "competencias", label: "Competências" },
];

export function ProfileSubnav({
  name,
  avatarUrl,
  headline,
}: {
  name: string;
  avatarUrl: string;
  headline: string;
}) {
  const [active, setActive] = useState("top");
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="sticky top-[52px] z-40 border-b border-hairline bg-white">
      <div className="mx-auto flex h-11 max-w-[1128px] items-center gap-1 px-2 sm:px-6">
        <div className="mr-2 hidden items-center gap-2 lg:flex">
          <Image
            src={avatarUrl}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="max-w-[128px] truncate text-sm font-semibold text-ink">{name}</span>
        </div>

        <nav
          aria-label="Seções do perfil"
          className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto"
        >
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={() => setActive(tab.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex shrink-0 items-center px-3 text-sm font-semibold whitespace-nowrap transition-colors sm:px-4",
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink hover:bg-surface-hover",
                )}
              >
                {tab.label}
                {isActive ? (
                  <span
                    className="absolute inset-x-2 bottom-0 h-[2px] rounded-t bg-[#01754f]"
                    aria-hidden="true"
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleShare}
          title={headline}
          className="li-btn li-btn-outline-muted h-7 shrink-0 px-3 text-[13px]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> Link copiado
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Compartilhar perfil</span>
              <span className="sm:hidden">Compartilhar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
