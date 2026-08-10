/** CSS class for a zone's severity band. Empty string is the healthy state. */
export type ZoneSeverity = '' | 'zone-warn' | 'zone-error';

/**
 * Litter zone: higher fill is healthier. Optimal (≥70%) → ok, mid (≥40%) →
 * warn, low → error. Level is capped at 100.
 */
export function litterSeverityClass(litterLevel: number): ZoneSeverity {
  const level = Math.min(100, litterLevel);
  if (level >= 70) return '';
  return level >= 40 ? 'zone-warn' : 'zone-error';
}

/**
 * Waste zone: higher fill is worse. Mirrors the bar gauge thresholds —
 * <50% → ok, 50–79% → warn, ≥80% → error. Level is capped at 100.
 */
export function wasteZoneSeverityClass(wasteLevel: number): ZoneSeverity {
  const level = Math.min(100, wasteLevel);
  if (level >= 80) return 'zone-error';
  return level >= 50 ? 'zone-warn' : '';
}
