import {
  MAX_PRIORITY,
  MIN_PRIORITY,
  PRIORITY_LEVELS,
  type PriorityLevel,
  comparePriorityDesc,
  getPriorityLabelKey,
  isPriorityLevel,
} from '../priority';

describe('priority constants', () => {
  it('should expose exactly five levels from 1 to 5 in ascending order', () => {
    expect(PRIORITY_LEVELS).toEqual([1, 2, 3, 4, 5]);
  });

  it('should define MIN_PRIORITY and MAX_PRIORITY as the bounds of PRIORITY_LEVELS', () => {
    expect(MIN_PRIORITY).toBe(1);
    expect(MAX_PRIORITY).toBe(5);
    expect(MIN_PRIORITY).toBe(PRIORITY_LEVELS[0]);
    expect(MAX_PRIORITY).toBe(PRIORITY_LEVELS[PRIORITY_LEVELS.length - 1]);
  });
});

describe('isPriorityLevel', () => {
  it.each(PRIORITY_LEVELS)('should accept valid level %d', (level) => {
    expect(isPriorityLevel(level)).toBe(true);
  });

  it.each([0, 6, -1, 100, -0.5])('should reject out-of-range number %p', (value) => {
    expect(isPriorityLevel(value)).toBe(false);
  });

  it.each([1.5, 4.999, 2.0000001])('should reject non-integer number %p', (value) => {
    expect(isPriorityLevel(value)).toBe(false);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'should reject special number %p',
    (value) => {
      expect(isPriorityLevel(value)).toBe(false);
    },
  );

  it.each([
    ['numeric string', '3'],
    ['empty string', ''],
    ['null', null],
    ['undefined', undefined],
    ['boolean true', true],
    ['bigint', BigInt(3)],
    ['object', { level: 3 }],
    ['array', [3]],
    ['boxed number', Object(3) as unknown],
  ])('should reject non-number value (%s)', (_label, value) => {
    expect(isPriorityLevel(value)).toBe(false);
  });

  it('should treat -0 as out of range', () => {
    expect(isPriorityLevel(-0)).toBe(false);
  });

  it('should narrow unknown input so it can be used as a PriorityLevel', () => {
    const raw: unknown = 4;
    if (!isPriorityLevel(raw)) {
      throw new Error('expected 4 to be a valid priority level');
    }
    // Compiles only because the type guard narrowed `raw` to PriorityLevel.
    expect(getPriorityLabelKey(raw)).toBe('priority.high');
  });
});

describe('getPriorityLabelKey', () => {
  it.each<[PriorityLevel, string]>([
    [1, 'priority.veryLow'],
    [2, 'priority.low'],
    [3, 'priority.medium'],
    [4, 'priority.high'],
    [5, 'priority.veryHigh'],
  ])('should map level %d to i18n key %s (ADR-0005 table)', (level, key) => {
    expect(getPriorityLabelKey(level)).toBe(key);
  });

  it('should return a distinct, non-empty key for every level', () => {
    const keys = PRIORITY_LEVELS.map(getPriorityLabelKey);
    keys.forEach((key) => {
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
      expect(key.startsWith('priority.')).toBe(true);
    });
    expect(new Set(keys).size).toBe(PRIORITY_LEVELS.length);
  });
});

describe('comparePriorityDesc', () => {
  it('should return a negative number when the first level is higher', () => {
    expect(comparePriorityDesc(5, 1)).toBeLessThan(0);
  });

  it('should return a positive number when the first level is lower', () => {
    expect(comparePriorityDesc(2, 4)).toBeGreaterThan(0);
  });

  it('should return zero for equal levels', () => {
    expect(comparePriorityDesc(3, 3)).toBe(0);
  });

  it('should sort levels from highest to lowest when used as a sort comparator', () => {
    const levels: PriorityLevel[] = [2, 5, 1, 3, 4, 3];
    expect([...levels].sort(comparePriorityDesc)).toEqual([5, 4, 3, 3, 2, 1]);
  });

  it('should keep the original order of tasks with equal priority (stable sort)', () => {
    const tasks: { id: string; priority: PriorityLevel }[] = [
      { id: 'a', priority: 3 },
      { id: 'b', priority: 5 },
      { id: 'c', priority: 3 },
      { id: 'd', priority: 1 },
    ];
    const sorted = [...tasks].sort((x, y) => comparePriorityDesc(x.priority, y.priority));
    expect(sorted.map((t) => t.id)).toEqual(['b', 'a', 'c', 'd']);
  });

  it('should be antisymmetric for every pair of levels', () => {
    PRIORITY_LEVELS.forEach((a) => {
      PRIORITY_LEVELS.forEach((b) => {
        // `|| 0` turns -0 into 0, because toBe uses Object.is and Object.is(0, -0) is false.
        const expected = -Math.sign(comparePriorityDesc(b, a)) || 0;
        expect(Math.sign(comparePriorityDesc(a, b))).toBe(expected);
      });
    });
  });
});
