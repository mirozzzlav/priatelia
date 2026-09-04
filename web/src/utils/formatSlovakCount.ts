export function getSlovakCountWord(base: string, count: number) {
  const absoluteCount = Math.abs(count);
  const lastTwoDigits = absoluteCount % 100;
  const lastDigit = absoluteCount % 10;

  if (lastTwoDigits === 1 || (lastDigit === 1 && lastTwoDigits !== 11)) {
    return base;
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return `${base}y`;
  }

  return `${base}ov`;
}
