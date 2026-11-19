import { MoreHorizontal } from "lucide-react";

export function AdCard() {
  return (
    <section aria-label="Anúncio" className="li-card">
      <div className="flex items-center justify-between px-3 pt-2">
        <p className="text-xs text-ink-muted">Anúncio · Patrocinado</p>
        <button type="button" className="li-icon-btn h-7 w-7" aria-label="Opções do anúncio">
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="px-4 pt-1 pb-4">
        <div className="rounded-lg bg-gradient-to-br from-[#0a66c2] via-[#0a4f9e] to-[#6a1b9a] p-4 text-white">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-90">
            LinkedIn Learning
          </p>
          <p className="mt-1 text-lg leading-tight font-bold">
            Fortaleça suas competências de design
          </p>
          <p className="mt-2 text-xs leading-snug opacity-90">
            Mais de 21.000 cursos com certificado. Grátis por 30 dias.
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">Experimente grátis</p>
            <p className="truncate text-xs text-ink-muted">linkedin.com/learning</p>
          </div>
          <a
            href="https://www.linkedin.com/learning"
            target="_blank"
            rel="noreferrer noopener"
            className="li-btn li-btn-outline shrink-0"
          >
            Saiba mais
          </a>
        </div>
      </div>
    </section>
  );
}
