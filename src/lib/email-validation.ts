export function isValidEmail(value: string) {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
