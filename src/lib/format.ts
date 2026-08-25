export function formatClock(date: Date, timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(date)
}

export function padStat(value: number, digits: number): string {
  return String(Math.round(value)).padStart(digits, '0')
}
