"use client";

import Image from "next/image";
import {
  Bell,
  Briefcase,
  ChevronDown,
  Grid3X3,
  House,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { LinkedInLogo } from "@/components/brand";
import { useProfileUI } from "@/components/profile-ui";
import { cn } from "@/lib/cn";

export type SearchItem = {
  id: string;
  label: string;
  detail: string;
  group: string;
  href: string;
};

type Panel = "notifications" | "account" | null;

const NOTIFICATIONS = [
  {
    id: "n1",
    actor: "Rafael Monteiro",
    action: "visualizou seu perfil",
    time: "há 2 h",
    avatar: "/images/person-1.jpg",
    unread: true,
  },
  {
    id: "n2",
    actor: "Juliana Prado",
    action: "comentou na sua publicação sobre design systems",
    time: "há 5 h",
    avatar: "/images/person-2.jpg",
    unread: true,
  },
  {
    id: "n3",
    actor: "LinkedIn",
    action: "Você apareceu em 48 pesquisas nesta semana",
    time: "há 1 dia",
    avatar: null,
    unread: false,
  },
];

export function ProfileHeader({
  profile,
  searchItems,
}: {
  profile: { name: string; headline: string; avatarUrl: string };
  searchItems: SearchItem[];
}) {
  const { openContact, openEdit } = useProfileUI();
  const [panel, setPanel] = useState<Panel>(null);
  const [activeNav, setActiveNav] = useState("inicio");
  const [query, setQuery] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!panel && !mobileSearch) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setPanel(null);
        if (query.trim() === "") setMobileSearch(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanel(null);
        setMobileSearch(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [panel, mobileSearch, query]);

  useEffect(() => {
    if (mobileSearch) inputRef.current?.focus();
  }, [mobileSearch]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 1) return [];
    return searchItems
      .filter(
        (item) =>
          item.label.toLowerCase().includes(term) || item.detail.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [query, searchItems]);

  const navItems: Array<{
    key: string;
    label: string;
    icon: LucideIcon;
    badge?: number;
    mobile?: boolean;
  }> = [
    { key: "inicio", label: "Início", icon: House, mobile: true },
    { key: "rede", label: "Minha rede", icon: Users },
    { key: "vagas", label: "Vagas", icon: Briefcase },
    { key: "mensagens", label: "Mensagens", icon: MessageSquare },
    { key: "notificacoes", label: "Notificações", icon: Bell, badge: 3, mobile: true },
  ];

  const closeAll = () => {
    setPanel(null);
    setMobileSearch(false);
    setQuery("");
  };

  const searchBox = (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Pesquisar"
        aria-label="Pesquisar no LinkedIn"
        className="h-[34px] w-full rounded-[4px] border border-transparent bg-[#edf3f8] py-1.5 pr-3 pl-9 text-sm text-ink placeholder:text-ink-muted focus:border-linkedin focus:bg-white focus:outline-none"
      />
      {query.trim().length > 0 ? (
        <div className="animate-slide-up absolute top-[42px] left-0 z-50 w-full min-w-[280px] overflow-hidden rounded-b-lg border border-hairline bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
          <p className="px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Resultados
          </p>
          {results.length === 0 ? (
            <p className="px-4 pb-3 text-sm text-ink-muted">Nenhum resultado encontrado.</p>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto">
              {results.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={closeAll}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-hover"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef3f8] text-xs font-semibold text-linkedin uppercase">
                      {item.group.slice(0, 2)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {item.label}
                      </span>
                      <span className="block truncate text-xs text-ink-muted">{item.detail}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-hairline bg-white"
    >
      <div className="relative mx-auto flex h-[52px] max-w-[1128px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {mobileSearch ? (
          <div className="flex w-full items-center gap-2">
            <div className="flex-1">{searchBox}</div>
            <button
              type="button"
              onClick={closeAll}
              className="li-btn li-btn-soft h-8 px-3 text-[13px]"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <>
            <a
              href="#top"
              aria-label="LinkedIn - Início"
              className="flex shrink-0 items-center rounded-sm"
            >
              <LinkedInLogo className="h-[34px] w-[34px]" />
            </a>

            <div className="hidden w-[180px] shrink-0 md:block lg:w-[280px]">{searchBox}</div>

            <nav aria-label="Navegação principal" className="ml-auto flex h-full items-stretch">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.key;
                const isNotifications = item.key === "notificacoes";

                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    aria-haspopup={isNotifications ? "menu" : undefined}
                    aria-expanded={isNotifications ? panel === "notifications" : undefined}
                    onClick={() => {
                      if (isNotifications) {
                        setPanel(panel === "notifications" ? null : "notifications");
                        return;
                      }
                      setActiveNav(item.key);
                      setPanel(null);
                    }}
                    className={cn(
                      "group relative flex w-[52px] flex-col items-center justify-center gap-0.5 px-1 text-ink-muted transition-colors hover:text-ink sm:w-[64px] lg:w-[80px]",
                      isActive && "text-ink",
                      !item.mobile && "hidden sm:flex",
                    )}
                  >
                    <span className="relative">
                      <Icon
                        className="h-[22px] w-[22px] lg:h-[24px] lg:w-[24px]"
                        strokeWidth={isActive ? 2.4 : 1.8}
                        aria-hidden="true"
                      />
                      {item.badge ? (
                        <span className="absolute -top-1.5 -right-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#cb112d] px-1 text-[10px] leading-none font-bold text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                    <span className="hidden text-[11px] leading-tight whitespace-nowrap md:block lg:text-xs">
                      {item.label}
                    </span>
                    {isActive ? (
                      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-ink" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}

              <div className="flex items-center">
                <button
                  type="button"
                  aria-label="Pesquisar"
                  onClick={() => setMobileSearch(true)}
                  className="li-icon-btn md:hidden"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setPanel(panel === "account" ? null : "account")}
                  aria-haspopup="menu"
                  aria-expanded={panel === "account"}
                  aria-label="Eu"
                  className="flex w-[52px] flex-col items-center justify-center gap-0.5 px-1 text-ink-muted transition-colors hover:text-ink sm:w-[64px] lg:w-[80px]"
                >
                  <Image
                    src={profile.avatarUrl}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="flex items-center gap-0.5 text-[11px] leading-tight lg:text-xs">
                    <span className="hidden md:inline">Eu</span>
                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </nav>

            <div className="hidden items-center border-l border-hairline pl-1 lg:flex">
              <button
                type="button"
                aria-label="Para negócios"
                className="flex w-[80px] flex-col items-center gap-0.5 px-1 text-ink-muted transition-colors hover:text-ink"
              >
                <Grid3X3 className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                <span className="text-center text-xs leading-tight">
                  Para negócios <ChevronDown className="inline h-3 w-3" aria-hidden="true" />
                </span>
              </button>
            </div>
          </>
        )}

        {panel === "notifications" ? (
          <div className="animate-slide-up absolute top-[52px] right-2 z-[60] w-[340px] max-w-[calc(100vw-16px)] overflow-hidden rounded-b-lg border border-hairline bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:right-6">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-base font-semibold text-ink">Notificações</p>
              <button type="button" className="li-icon-btn" onClick={() => setPanel(null)}>
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Fechar notificações</span>
              </button>
            </div>
            <ul className="max-h-[360px] overflow-y-auto">
              {NOTIFICATIONS.map((notification) => (
                <li
                  key={notification.id}
                  className={cn(
                    "flex gap-3 border-t border-hairline px-4 py-3 hover:bg-surface-hover",
                    notification.unread && "bg-[#edf3f8]/70",
                  )}
                >
                  {notification.avatar ? (
                    <Image
                      src={notification.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linkedin text-white">
                      <LinkedInLogo className="h-5 w-5 text-white" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm leading-snug text-ink">
                      <span className="font-semibold">{notification.actor}</span>{" "}
                      {notification.action}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">{notification.time}</p>
                  </div>
                  {notification.unread ? (
                    <span className="mt-1.5 ml-auto h-2 w-2 shrink-0 rounded-full bg-linkedin" />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {panel === "account" ? (
          <div className="animate-slide-up absolute top-[52px] right-2 z-[60] w-[300px] max-w-[calc(100vw-16px)] overflow-hidden rounded-b-lg border border-hairline bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:right-6">
            <div className="flex items-center gap-3 px-4 py-4">
              <Image
                src={profile.avatarUrl}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-ink">{profile.name}</p>
                <p className="line-clamp-2 text-xs text-ink-muted">{profile.headline}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                closeAll();
                openEdit();
              }}
              className="block w-full border-t border-hairline px-4 py-2.5 text-left text-sm font-semibold text-ink hover:bg-surface-hover"
            >
              Editar perfil
            </button>
            <button
              type="button"
              onClick={() => {
                closeAll();
                openContact();
              }}
              className="block w-full border-t border-hairline px-4 py-2.5 text-left text-sm font-semibold text-ink hover:bg-surface-hover"
            >
              Informações de contato
            </button>
            <a
              href="#competencias"
              onClick={closeAll}
              className="flex items-center gap-2 border-t border-hairline px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-hover"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" /> Competências
            </a>
            <div className="flex items-center gap-2 border-t border-hairline px-4 py-2.5 text-sm text-ink-muted">
              <Settings className="h-4 w-4" aria-hidden="true" /> Configurações e privacidade
            </div>
            <button
              type="button"
              onClick={closeAll}
              className="flex w-full items-center gap-2 border-t border-hairline px-4 py-2.5 text-left text-sm font-semibold text-ink hover:bg-surface-hover"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
            </button>
          </div>
        ) : null}
      </div>

    </header>
  );
}
