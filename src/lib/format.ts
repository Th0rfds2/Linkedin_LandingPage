const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatFollowers(value: number): string {
  if (value >= 1000) {
    const short = value % 1000 === 0 ? value / 1000 : Number((value / 1000).toFixed(1));
    return `${numberFormatter.format(short)} mil`;
  }
  return numberFormatter.format(value);
}

export function formatConnections(value: number): string {
  return value > 500 ? `${numberFormatter.format(value)} conexões` : `Mais de 500 conexões`;
}

export function durationInMonths(
  startYear: number,
  startMonth: number,
  endYear?: number | null,
  endMonth?: number | null,
): number {
  const now = new Date();
  const endY = endYear ?? now.getFullYear();
  const endM = endMonth ?? now.getMonth() + 1;
  const total = (endY - startYear) * 12 + (endM - startMonth) + 1;
  return Math.max(total, 1);
}

export function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "mês" : "meses"}`);

  return parts.join(" e ") || "1 mês";
}

export function formatMonthYear(month: number, year: number): string {
  const label = MONTHS[Math.min(Math.max(month, 1), 12) - 1];
  return `${label} de ${year}`;
}

export function formatPeriod(
  startMonth: number,
  startYear: number,
  endMonth?: number | null,
  endYear?: number | null,
  isCurrent?: boolean,
): { range: string; duration: string } {
  const start = formatMonthYear(startMonth, startYear);
  const end = isCurrent
    ? "o momento"
    : endMonth && endYear
      ? formatMonthYear(endMonth, endYear)
      : "o momento";

  return {
    range: `${start} - ${end}`,
    duration: formatDuration(durationInMonths(startYear, startMonth, endYear, endMonth)),
  };
}

export function formatYearRange(startYear: number, endYear?: number | null): string {
  return `${startYear} - ${endYear ?? "o momento"}`;
}
