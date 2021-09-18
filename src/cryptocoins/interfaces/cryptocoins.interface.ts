export interface ITransferCrypto {
  id: string;
  walletFrom: string;
  walletTo: string;
}

export interface ICrypto {
  currency: string;
  currencyRateFromUSD: number;
  coinName: string;
  coin: string;
  regularMarketChange: number;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketDayLow: number;
  regularMarketDayHigh: number;
  regularMarketDayRange: string;
  regularMarketVolume: number;
  marketCap: number;
  regularMarketTime: number;
  coinImageUrl: string;
}
