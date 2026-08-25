export function warnEmptyQuery(hookName: string, selector: string) {
  if (import.meta.env.DEV) {
    console.warn(
      `[${hookName}] query "${selector}" matched nothing — the animation this hook owns is silently disabled. Check the markup contract.`,
    )
  }
}
