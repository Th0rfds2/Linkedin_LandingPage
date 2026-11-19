import { BarChart3, Eye, Search, ShieldCheck } from "lucide-react";

import { formatNumber } from "@/lib/format";

export function AnalyticsCard({
  profileViews,
  postImpressions,
  searchAppearances,
}: {
  profileViews: number;
  postImpressions: number;
  searchAppearances: number;
}) {
  const items = [
    {
      icon: Eye,
      value: profileViews,
      label: "Quem viu seu perfil",
      detail: "Últimos 90 dias",
    },
    {
      icon: BarChart3,
      value: postImpressions,
      label: "Impressões dos posts",
      detail: "+12% na última semana",
    },
    {
      icon: Search,
      value: searchAppearances,
      label: "Pesquisas",
      detail: "Aparições na última semana",
    },
  ];

  return (
    <section aria-label="Análises do perfil" className="li-card">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 sm:px-6">
        <h2 className="li-section-title">Análises</h2>
        <p className="flex items-center gap-1 text-xs font-semibold text-ink-muted">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Somente para você
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 divide-x divide-hairline">
        {items.map(({ icon: Icon, value, label, detail }) => (
          <button
            key={label}
            type="button"
            className="group flex flex-col gap-1 px-3 py-3 text-left transition-colors hover:bg-surface-hover sm:px-4"
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Icon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
              {formatNumber(value)}
            </span>
            <span className="text-xs leading-tight text-ink-muted">
              <span className="line-clamp-2">{label}</span>
            </span>
            <span className="hidden text-[11px] leading-tight font-semibold text-[#01754f] sm:block">
              {detail}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
