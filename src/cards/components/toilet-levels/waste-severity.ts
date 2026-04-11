/** CSS class for waste gauge severity: warn at 50–79%, error at 80%+. Level is capped at 100. */
export function wasteSeverityClass(
  wasteLevel: number,
): '' | 'gauge-warn' | 'gauge-error' {
  const w = Math.min(100, wasteLevel);
  if (w >= 80) return 'gauge-error';
  if (w >= 50) return 'gauge-warn';
  return '';
}
