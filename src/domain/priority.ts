/**
 * Task priority model (ADR-0005).
 * Priority is stored as a level (1-5), never as a name. The label is resolved
 * separately through an i18n key so that language changes and the Phase 2
 * custom labels do not touch stored data.
 */

export const PRIORITY_LEVELS = [1, 2, 3, 4, 5] as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

export const MIN_PRIORITY: PriorityLevel = 1;
export const MAX_PRIORITY: PriorityLevel = 5;

const LABEL_KEYS = {
  1: 'priority.veryLow',
  2: 'priority.low',
  3: 'priority.medium',
  4: 'priority.high',
  5: 'priority.veryHigh',
} as const satisfies Record<PriorityLevel, string>;

// Literal union of the i18n keys, so they can be checked against the translation files later.
export type PriorityLabelKey = (typeof LABEL_KEYS)[PriorityLevel];

// Type guard: narrows an unknown value (e.g. a DB column or form value) to PriorityLevel.
export function isPriorityLevel(value: unknown): value is PriorityLevel {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= MIN_PRIORITY &&
    value <= MAX_PRIORITY
  );
}

export function getPriorityLabelKey(level: PriorityLevel): PriorityLabelKey {
  return LABEL_KEYS[level];
}

// Sorts higher priority first; usable directly as an Array.prototype.sort comparator.
export function comparePriorityDesc(a: PriorityLevel, b: PriorityLevel): number {
  return b - a;
}
