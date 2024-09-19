export interface Quote {
  date: Date;
  close: number;
}

export function calculateBollingerBands(quotes: Quote[], windowSize: number = 20, k: number = 2) {
  const sma: number[] = [];
  const sd: number[] = [];
  const upperBand: number[] = [];
  const lowerBand: number[] = [];

  for (let i = windowSize - 1; i < quotes.length; i++) {
    const window = quotes.slice(i - windowSize + 1, i + 1);
    const mean = window.reduce((sum, quote) => sum + quote.close, 0) / windowSize;
    const variance = window.reduce((sum, quote) => sum + Math.pow(quote.close - mean, 2), 0) / windowSize;
    const standardDeviation = Math.sqrt(variance);

    sma.push(mean);
    sd.push(standardDeviation);
    upperBand.push(mean + k * standardDeviation);
    lowerBand.push(mean - k * standardDeviation);
  }

  return { sma, sd, upperBand, lowerBand };
}