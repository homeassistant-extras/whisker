/** Artwork families that ship with the card. */
export type ModelKey = 'lr4' | 'lr5' | 'lr5-pro' | 'lre';

/** Family used when the device model/serial can't be recognized. */
export const DEFAULT_MODEL: ModelKey = 'lr5';

/**
 * Detects the artwork family. The serial number is authoritative — its prefix
 * encodes the hardware (LR4 → lr4, LR5 → lr5, LRE → Litter-Robot Evo) — while
 * the model string only distinguishes the LR5 "Pro" variant. Falls back to
 * parsing the model string when no (recognized) serial is available.
 */
export const detectModelKey = (
  model: string | null | undefined,
  serial: string | null | undefined,
): ModelKey => {
  const s = (serial ?? '').trim().toUpperCase();
  const m = (model ?? '').toLowerCase();
  const isPro = m.includes('pro');

  if (s.startsWith('LR5')) return isPro ? 'lr5-pro' : 'lr5';
  if (s.startsWith('LR4')) return 'lr4';
  if (s.startsWith('LRE')) return 'lre';

  // No (recognized) serial — fall back to the model string.
  if (m.includes('evo')) return 'lre';
  if (m.includes('5')) return isPro ? 'lr5-pro' : 'lr5';
  if (m.includes('4')) return 'lr4';

  return DEFAULT_MODEL;
};
