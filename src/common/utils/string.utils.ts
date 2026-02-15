export function normalizeTrimmed(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim();
}

export function normalizeUpperTrimmed(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim().toUpperCase();
}

export function normalizeCapitalized(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}
