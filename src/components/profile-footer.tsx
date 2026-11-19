import { LinkedInLogo } from "@/components/brand";

const FOOTER_COLUMNS = [
  ["Sobre", "Acessibilidade", "Central de ajuda"],
  ["Privacidade e termos", "Preferências de anúncio", "Publicidade"],
  ["Soluções de negócios", "Diretrizes da comunidade", "Carreiras"],
  ["Seleção de cookies", "Marketing", "Aplicativos móveis"],
  ["Serviços empresariais", "Talentos", "Soluções de vendas"],
];

export function ProfileFooter() {
  return (
    <footer className="mt-2 pb-10 text-xs text-ink-muted">
      <div className="flex items-center gap-2">
        <LinkedInLogo className="h-5 w-5" />
        <span className="font-semibold text-ink">LinkedIn</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-5">
        {FOOTER_COLUMNS.map((column, index) => (
          <ul key={index} className="space-y-1.5">
            {column.map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-linkedin hover:underline">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-hairline pt-4">
        <span>LinkedIn Corporation © 2026</span>
        <label className="flex items-center gap-1.5 font-semibold text-ink">
          <span className="sr-only">Idioma</span>
          <select
            defaultValue="pt-BR"
            className="rounded border border-ink-muted/50 bg-white px-2 py-1 text-xs text-ink"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
        <span className="hidden sm:inline">Clone educacional — projeto 7days HTML e CSS</span>
      </div>
    </footer>
  );
}
