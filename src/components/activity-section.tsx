"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Globe2,
  ImageIcon,
  MessageSquare,
  MoreHorizontal,
  Repeat2,
  Send,
  ThumbsUp,
  Video,
} from "lucide-react";

import { useProfileUI } from "@/components/profile-ui";
import { cn } from "@/lib/cn";
import { formatFollowers, formatNumber } from "@/lib/format";

type ActivityItem = {
  id: number;
  kind: string;
  body: string;
  hashtags: string[];
  postedAgo: string;
  visibility: string;
  likes: number;
  comments: number;
  reposts: number;
  likedByMe: boolean;
};

const TABS = [
  { id: "posts", label: "Publicações" },
  { id: "comments", label: "Comentários" },
  { id: "videos", label: "Vídeos" },
  { id: "images", label: "Imagens" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const EMPTY_STATES: Record<Exclude<TabId, "posts">, { title: string; description: string; icon: typeof MessageSquare }> = {
  comments: {
    title: "Nenhum comentário público ainda",
    description: "Quando você comentar em uma publicação, ele aparecerá aqui.",
    icon: MessageSquare,
  },
  videos: {
    title: "Nenhum vídeo publicado",
    description: "Compartilhe um vídeo para mostrar sua experiência na prática.",
    icon: Video,
  },
  images: {
    title: "Nenhuma imagem publicada",
    description: "Fotos de eventos e projetos aparecem nesta aba.",
    icon: ImageIcon,
  },
};

export function ActivitySection({
  profile,
  followers,
  activities,
}: {
  profile: { name: string; headline: string; avatarUrl: string };
  followers: number;
  activities: ActivityItem[];
}) {
  const { notify } = useProfileUI();
  const [tab, setTab] = useState<TabId>("posts");
  const [items, setItems] = useState(activities);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const handleLike = async (activityId: number) => {
    setPendingId(activityId);
    try {
      const response = await fetch("/api/activities/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as { liked: boolean; likes: number };
      setItems((current) =>
        current.map((item) =>
          item.id === activityId
            ? { ...item, likedByMe: data.liked, likes: data.likes }
            : item,
        ),
      );
    } finally {
      setPendingId(null);
    }
  };

  const emptyState = tab === "posts" ? null : EMPTY_STATES[tab];

  return (
    <section id="atividades" aria-label="Atividades" className="li-card scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-5 sm:px-6">
        <div>
          <h2 className="li-section-title">Atividades</h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            {formatFollowers(followers)} seguidores
          </p>
        </div>
        <button
          type="button"
          className="li-link text-sm"
          onClick={() => notify("Nova publicação: disponível na versão completa do LinkedIn.")}
        >
          Criar publicação
        </button>
      </div>

      <div className="no-scrollbar mt-3 flex items-stretch gap-1 overflow-x-auto border-b border-hairline px-2 sm:px-4">
        {TABS.map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative shrink-0 px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors sm:px-4",
                isActive ? "text-[#01754f]" : "text-ink-muted hover:bg-surface-hover hover:text-ink",
              )}
            >
              {item.label}
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-0 h-[2px] rounded-t bg-[#01754f]"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="px-3 py-4 sm:px-4">
        {emptyState ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <emptyState.icon className="h-8 w-8 text-ink-faint" aria-hidden="true" />
            <p className="text-base font-semibold text-ink">{emptyState.title}</p>
            <p className="max-w-[360px] text-sm text-ink-muted">{emptyState.description}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((activity) => (
              <article
                key={activity.id}
                className="overflow-hidden rounded-lg border border-hairline bg-white"
              >
                <header className="flex items-start gap-2.5 p-3 sm:p-4">
                  <Image
                    src={profile.avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight font-semibold text-ink">{profile.name}</p>
                    <p className="line-clamp-1 text-xs text-ink-muted">{profile.headline}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                      {activity.postedAgo}
                      <span aria-hidden="true">·</span>
                      <Globe2 className="h-3 w-3" aria-hidden="true" />
                      {activity.kind === "article" ? (
                        <span className="ml-1 rounded bg-[#edf3f8] px-1.5 py-0.5 text-[10px] font-semibold text-linkedin uppercase">
                          Artigo
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <button type="button" className="li-icon-btn" aria-label="Opções da publicação">
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>
                </header>

                <div className="px-3 pb-3 sm:px-4">
                  <p className="li-body-text whitespace-pre-line">{activity.body}</p>
                  {activity.hashtags.length > 0 ? (
                    <p className="mt-2 text-sm font-semibold text-linkedin">
                      {activity.hashtags.join(" ")}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1 border-t border-hairline px-3 py-2 text-xs text-ink-muted sm:px-4">
                  <span className="flex items-center gap-1">
                    <span className="flex -space-x-1" aria-hidden="true">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#378fe9] text-[9px] text-white ring-1 ring-white">
                        👍
                      </span>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#df704d] text-[9px] text-white ring-1 ring-white">
                        ❤
                      </span>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f5bb5c] text-[9px] text-white ring-1 ring-white">
                        💡
                      </span>
                    </span>
                    <span className="ml-1 hover:text-linkedin hover:underline">
                      {formatNumber(activity.likes)}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span>{formatNumber(activity.comments)} comentários</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatNumber(activity.reposts)} republicações</span>
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-0.5 border-t border-hairline px-1 py-1">
                  <button
                    type="button"
                    onClick={() => handleLike(activity.id)}
                    disabled={pendingId === activity.id}
                    aria-pressed={activity.likedByMe}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded px-1 py-2 text-xs font-semibold transition-colors hover:bg-surface-hover sm:text-sm",
                      activity.likedByMe ? "text-linkedin" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    <ThumbsUp
                      className={cn("h-4 w-4", activity.likedByMe && "fill-current")}
                      aria-hidden="true"
                    />
                    Gostei
                  </button>
                  <button
                    type="button"
                    onClick={() => notify("Os comentários são somente leitura nesta demonstração.")}
                    className="flex items-center justify-center gap-1.5 rounded px-1 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink sm:text-sm"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    Comentar
                  </button>
                  <button
                    type="button"
                    onClick={() => notify("Compartilhar com sua rede estará disponível em breve.")}
                    className="flex items-center justify-center gap-1.5 rounded px-1 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink sm:text-sm"
                  >
                    <Repeat2 className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Republicar</span>
                    <span className="sm:hidden">Repost</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => notify("Envio por mensagem estará disponível em breve.")}
                    className="flex items-center justify-center gap-1.5 rounded px-1 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink sm:text-sm"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Enviar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
