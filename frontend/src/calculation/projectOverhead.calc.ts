function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function tier<T extends { max: number }>(
  m2: number,
  tiers: (T & { val: number })[],
  above: number,
) {
  for (const t of tiers) {
    if (m2 <= t.max) return t.val;
  }
  return above;
}

// ==========================
// BAUSTELLENGEMEINKOSTEN
// ==========================
export function calcBGK(m2: number) {
  return tier(
    m2,
    [
      { max: 50, val: 697.27 },
      { max: 60, val: 833.8 },
      { max: 80, val: 866.71 },
      { max: 90, val: 971.54 },
    ],
    1076.38,
  );
}

// ==========================
// PLZ ZUSCHLAG 1010–1099
// ==========================
export function calcPlzZuschlag(m2: number, isCentralVienna: boolean) {
  if (!isCentralVienna) return 0;

  const rate = m2 <= 60 ? 65 : 31;
  return round2(rate * m2);
}

// ==========================
// TOTAL OVERHEAD
// ==========================
export function calcProjectOverhead(m2: number, isCentralVienna: boolean) {
  const bgk = calcBGK(m2);
  const plz = calcPlzZuschlag(m2, isCentralVienna);

  return {
    bgk,
    plz,
    total: round2(bgk + plz),
  };
}
