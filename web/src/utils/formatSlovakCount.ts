export function getSlovakCountWord(base: string, count: number) {
  const absoluteCount = Math.abs(count);

  if (absoluteCount === 1) {
    return base;
  }

  if (absoluteCount >= 2 && absoluteCount <= 4) {
    return `${base}y`;
  }

  if (absoluteCount === 0 || absoluteCount >= 5) {
    return `${base}ov`;
  }

  return `${base}ov`;
}
