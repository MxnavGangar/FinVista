"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import PortfolioAllocationChart
from "@/components/PortfolioAllocationChart";
import {
  convertCurrency,
  defaultCurrency,
  defaultExchangeRates,
  formatCurrency,
  getAssetBaseCurrency,
  isSupportedCurrency,
  supportedCurrencies,
  type ExchangeRates,
  type SupportedCurrency,
} from "@/lib/currency";

type AssetType = "stock" | "crypto";

type Investment = {
  _id: string;
  assetName: string;
  symbol: string;
  type: AssetType;
  quantity: number;
  buyPrice: number;
  currentPrice?: number;
  
};

type MarketMover = {
  name: string;
  symbol: string;
  price: number;
  percentChange: number;
  change: number;
  currency?: string;
  type: AssetType;
};

type MarketMovers = {
  topGainers: MarketMover[];
  topLosers: MarketMover[];
  trendingCrypto: MarketMover[];
  errors?: Partial<
    Record<"topGainers" | "topLosers" | "trendingCrypto", string | null>
  >;
  updatedAt?: string;
};

type MarketMoversResponse = {
  assets?: MarketMover[];
  error?: string | null;
  updatedAt?: string;
};

type ExchangeRatesResponse = {
  rates?: Partial<Record<SupportedCurrency, number>>;
};

type SearchResult = {
  instrument_name: string;
  symbol: string;
};

type AnalyticsCard = {
  label: string;
  value: string;
  helper: string;
  valueClassName?: string;
};

const emptyMarketMovers: MarketMovers = {
  topGainers: [],
  topLosers: [],
  trendingCrypto: [],
};

const MARKET_MOVER_LIMIT = 4;
const CURRENCY_STORAGE_KEY = "finvista:selected-currency";

function assetTypeClasses(type: AssetType) {
  return type === "stock"
    ? "border-sky-500/20 bg-sky-500/10 text-sky-300"
    : "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

function buildMarketMovers(assets: MarketMover[], updatedAt?: string): MarketMovers {
  const stocks = assets.filter((asset) => asset.type === "stock");
  const crypto = assets.filter((asset) => asset.type === "crypto");

  return {
    topGainers: [...stocks]
      .sort((a, b) => b.percentChange - a.percentChange)
      .slice(0, MARKET_MOVER_LIMIT),
    topLosers: [...stocks]
      .sort((a, b) => a.percentChange - b.percentChange)
      .slice(0, MARKET_MOVER_LIMIT),
    trendingCrypto: [...crypto]
      .sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))
      .slice(0, MARKET_MOVER_LIMIT),
    errors: {
      topGainers: stocks.length === 0 ? "No stock quotes available." : null,
      topLosers: stocks.length === 0 ? "No stock quotes available." : null,
      trendingCrypto: crypto.length === 0 ? "No crypto quotes available." : null,
    },
    updatedAt,
  };
}

function getCurrencyFromStorage() {
  if (typeof window === "undefined") {
    return defaultCurrency;
  }

  const storedCurrency = window.localStorage.getItem(CURRENCY_STORAGE_KEY);

  return storedCurrency && isSupportedCurrency(storedCurrency)
    ? storedCurrency
    : defaultCurrency;
}

function getInvestmentBaseCurrency(investment: Investment) {
  return getAssetBaseCurrency(investment.type);
}

function getMarketMoverCurrency(asset: MarketMover) {
  const currency = asset.currency;

  return currency && isSupportedCurrency(currency)
    ? currency
    : getAssetBaseCurrency(asset.type);
}

export default function PortfolioPage() {
  const [selectedCurrency, setSelectedCurrency] =
    useState<SupportedCurrency>(defaultCurrency);
  const [exchangeRates, setExchangeRates] =
    useState<ExchangeRates>(defaultExchangeRates);
  const [exchangeRatesLoading, setExchangeRatesLoading] = useState(true);
  const [exchangeRatesError, setExchangeRatesError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketMovers, setMarketMovers] =
    useState<MarketMovers>(emptyMarketMovers);
  const [marketMoversLoading, setMarketMoversLoading] = useState(true);
  const [marketMoversError, setMarketMoversError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [assetName, setAssetName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState<AssetType>("stock");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const isRefreshingRef = useRef(false);
  const isMarketMoversRefreshingRef = useRef(false);
  const isExchangeRatesRefreshingRef = useRef(false);

  const portfolioAnalytics = useMemo(() => {
    let totalInvested = 0;
    let totalValue = 0;
    let bestPerformer = "N/A";
    let bestGrowth = -Infinity;

    investments.forEach((investment) => {
      const baseCurrency = getInvestmentBaseCurrency(investment);
      const investedAmount = convertCurrency(
        investment.quantity * investment.buyPrice,
        baseCurrency,
        selectedCurrency,
        exchangeRates
      );
      const currentAmount = convertCurrency(
        investment.quantity * (investment.currentPrice || 0),
        baseCurrency,
        selectedCurrency,
        exchangeRates
      );
      const growth = currentAmount - investedAmount;

      totalInvested += investedAmount;
      totalValue += currentAmount;

      if (growth > bestGrowth) {
        bestGrowth = growth;
        bestPerformer = investment.assetName;
      }
    });

    const totalProfit = totalValue - totalInvested;
    const profitPercentage =
      totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return {
      bestPerformer,
      profitPercentage,
      totalInvested,
      totalProfit,
      totalValue,
    };
  }, [exchangeRates, investments, selectedCurrency]);

  const analyticsCards = useMemo<AnalyticsCard[]>(
    () => [
      {
        label: "Portfolio Value",
        value: formatCurrency(portfolioAnalytics.totalValue, selectedCurrency),
        helper: "Live mark-to-market value",
      },
      {
        label: "Total Invested",
        value: formatCurrency(portfolioAnalytics.totalInvested, selectedCurrency),
        helper: "Capital deployed",
      },
      {
        label: "Profit / Loss",
        value: `${portfolioAnalytics.totalProfit >= 0 ? "+" : ""}${formatCurrency(
          portfolioAnalytics.totalProfit,
          selectedCurrency
        )}`,
        helper: `${profitPrefix(portfolioAnalytics.profitPercentage)}${portfolioAnalytics.profitPercentage.toFixed(2)}% overall`,
        valueClassName:
          portfolioAnalytics.totalProfit >= 0
            ? "text-emerald-300"
            : "text-rose-300",
      },
      {
        label: "Best Performer",
        value: portfolioAnalytics.bestPerformer,
        helper: "Highest absolute gain",
      },
    ],
    [portfolioAnalytics, selectedCurrency]
  );

const fetchInvestments = useCallback(
  async (signal?: AbortSignal) => {

    if (isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;

    try {

      const res = await fetch(
        "/api/investments",
        { signal }
      );

      const data: Investment[] =
        await res.json();

      const updatedInvestments =
        await Promise.all(

          data.map(async (investment) => {

            try {

              const res = await fetch(
                `/api/price?symbol=${investment.symbol}`,
                { signal }
              );

              const priceData =
                await res.json();

              return {
                ...investment,
                currentPrice: Number(
                  priceData.price || 0
                ),
              };

            } catch {

              return {
                ...investment,
                currentPrice: 0,
              };
            }
          })
        );

      if (signal?.aborted) {
        return;
      }

      setInvestments(updatedInvestments);
      console.log(updatedInvestments);

    } catch (error) {

      if (!signal?.aborted) {
        console.log(error);
      }

    } finally {

      isRefreshingRef.current = false;

      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  },
  []
);

  const fetchMarketMovers = useCallback(async (signal?: AbortSignal) => {
    if (isMarketMoversRefreshingRef.current) {
      return;
    }

    isMarketMoversRefreshingRef.current = true;

    try {
      const res = await fetch("/api/market-movers", { signal });
      const data: MarketMoversResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch market movers");
      }

      if (signal?.aborted) {
        return;
      }

      setMarketMovers(buildMarketMovers(data.assets || [], data.updatedAt));
      setMarketMoversError(data.error || "");
    } catch (error) {
      if (!signal?.aborted) {
        console.log(error);
        setMarketMoversError("Unable to refresh market movers right now.");
      }
    } finally {
      isMarketMoversRefreshingRef.current = false;

      if (!signal?.aborted) {
        setMarketMoversLoading(false);
      }
    }
  }, []);

  const fetchExchangeRates = useCallback(async (signal?: AbortSignal) => {
    if (isExchangeRatesRefreshingRef.current) {
      return;
    }

    isExchangeRatesRefreshingRef.current = true;

    try {
      const res = await fetch(
        "https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR,EUR",
        { signal }
      );
      const data: ExchangeRatesResponse = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      if (signal?.aborted) {
        return;
      }

      setExchangeRates({
        INR: Number(data.rates?.INR || defaultExchangeRates.INR),
        USD: 1,
        EUR: Number(data.rates?.EUR || defaultExchangeRates.EUR),
      });
      setExchangeRatesError("");
    } catch (error) {
      if (!signal?.aborted) {
        console.log(error);
        setExchangeRatesError("Using fallback exchange rates.");
      }
    } finally {
      isExchangeRatesRefreshingRef.current = false;

      if (!signal?.aborted) {
        setExchangeRatesLoading(false);
      }
    }
  }, []);

  async function handleSearch(query: string) {
    setSearch(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);

      const res = await fetch(`/api/search?query=${query}`);
      const data: SearchResult[] = await res.json();

      setSearchResults(data);
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  }

  async function fetchLivePrice(symbol: string) {
  try {
    const res = await fetch(
      `/api/price?symbol=${encodeURIComponent(symbol)}`
    );

    const data = await res.json();

    const price = Number(data.price || 0);

    setCurrentPrice(price);

    return price;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function handleDeleteInvestment(id: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this investment?"
  );

  if (!confirmed) return;

  try {
    const res = await fetch(
      `/api/investments/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      await fetchInvestments();
    }
  } catch (error) {
    console.log(error);
  }
}

  async function handleQuickAdd(asset: MarketMover) {
  setAssetName(asset.name);
  setSymbol(asset.symbol);
  setType(asset.type);
  setSearch(asset.name);

  const livePrice = await fetchLivePrice(asset.symbol);

if (livePrice) {
  

  setBuyPrice(livePrice.toString());
}

  setShowModal(true);
}

  async function handleAddInvestment(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetName,
          symbol,
          type,
          quantity: Number(quantity),
          buyPrice: Number(buyPrice),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchInvestments();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function resetForm() {
    setAssetName("");
    setSymbol("");
    setType("stock");
    setQuantity("");
    setBuyPrice("");
    setSearch("");
    setSearchResults([]);
    setCurrentPrice(null);
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  function handleCurrencyChange(currency: SupportedCurrency) {
    setSelectedCurrency(currency);
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }

  useEffect(() => {
    void Promise.resolve().then(() => {
      setSelectedCurrency(getCurrencyFromStorage());
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const refreshPortfolio = () => {
      void fetchInvestments(controller.signal);
      void fetchMarketMovers(controller.signal);
      void fetchExchangeRates(controller.signal);
    };

    void Promise.resolve().then(refreshPortfolio);

    const intervalId = window.setInterval(refreshPortfolio, 120000);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [fetchExchangeRates, fetchInvestments, fetchMarketMovers]);

  return (
    <main className="min-h-screen bg-[#07090D] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Header
          exchangeRatesError={exchangeRatesError}
          exchangeRatesLoading={exchangeRatesLoading}
          onAddInvestment={() => setShowModal(true)}
          onCurrencyChange={handleCurrencyChange}
          selectedCurrency={selectedCurrency}
        />

        <AnalyticsSection cards={analyticsCards} />

        <MarketMoversSection
          error={marketMoversError}
          loading={marketMoversLoading}
          movers={marketMovers}
          onQuickAdd={handleQuickAdd}
          rates={exchangeRates}
          selectedCurrency={selectedCurrency}
        />
        {investments.length > 0 && (
          <PortfolioAllocationChart
  investments={investments}
  rates={exchangeRates}
  selectedCurrency={selectedCurrency}
/>
)}
        <InvestmentsSection
  investments={investments}
  loading={loading}
  rates={exchangeRates}
  selectedCurrency={selectedCurrency}
  onDelete={handleDeleteInvestment}
/>
      </div>

      {showModal && (
        <AddInvestmentModal
          assetName={assetName}
          buyPrice={buyPrice}
          currentPrice={currentPrice}
          currentPriceCurrency={getAssetBaseCurrency(type)}
          onAssetNameChange={setAssetName}
          onBuyPriceChange={setBuyPrice}
          onClose={closeModal}
          onQuantityChange={setQuantity}
          onSearch={handleSearch}
          onSelectResult={async (item) => {
  setAssetName(item.instrument_name);
  setSymbol(item.symbol);
  setSearch(item.instrument_name);
  setSearchResults([]);
  const detectedType: AssetType =
  item.symbol.includes("-USD")
    ? "crypto"
    : "stock";

setType(detectedType);

  const livePrice = await fetchLivePrice(item.symbol);

if (livePrice) {
  setBuyPrice(livePrice.toString());
}

}}
          onSubmit={handleAddInvestment}
          onSymbolChange={setSymbol}
          onTypeChange={setType}
          quantity={quantity}
          search={search}
          searchLoading={searchLoading}
          searchResults={searchResults}
          symbol={symbol}
          type={type}
          rates={exchangeRates}
          selectedCurrency={selectedCurrency}
        />
      )}
    </main>
  );
}

function profitPrefix(value: number) {
  return value >= 0 ? "+" : "";
}

function Header({
  exchangeRatesError,
  exchangeRatesLoading,
  onAddInvestment,
  onCurrencyChange,
  selectedCurrency,
}: {
  exchangeRatesError: string;
  exchangeRatesLoading: boolean;
  onAddInvestment: () => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  selectedCurrency: SupportedCurrency;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Portfolio
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Investment Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Track holdings, live prices, and portfolio performance across stocks
          and crypto.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <CurrencySelector
          exchangeRatesError={exchangeRatesError}
          exchangeRatesLoading={exchangeRatesLoading}
          onCurrencyChange={onCurrencyChange}
          selectedCurrency={selectedCurrency}
        />

        <button
          onClick={onAddInvestment}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 sm:w-auto"
        >
          Add Investment
        </button>
      </div>
    </header>
  );
}

function CurrencySelector({
  exchangeRatesError,
  exchangeRatesLoading,
  onCurrencyChange,
  selectedCurrency,
}: {
  exchangeRatesError: string;
  exchangeRatesLoading: boolean;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  selectedCurrency: SupportedCurrency;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-400">
      <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        Currency
      </span>

      <div className="flex items-center gap-3">
        <select
          value={selectedCurrency}
          onChange={(event) => {
            const nextCurrency = event.target.value;

            if (isSupportedCurrency(nextCurrency)) {
              onCurrencyChange(nextCurrency);
            }
          }}
          className="h-11 rounded-2xl border border-white/10 bg-[#101318] px-4 text-sm font-semibold text-white outline-none transition hover:border-white/20 focus:border-emerald-400/50"
        >
          {supportedCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            exchangeRatesError
              ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {exchangeRatesLoading
            ? "Loading rates"
            : exchangeRatesError || "Live FX"}
        </span>
      </div>
    </label>
  );
}

function AnalyticsSection({ cards }: { cards: AnalyticsCard[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="flex min-h-36 flex-col justify-between rounded-3xl border border-white/10 bg-[#101318] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-6"
        >
          <div>
            <p className="text-sm text-zinc-400">{card.label}</p>
            <h2
              className={`mt-3 break-words text-2xl font-semibold tracking-tight sm:text-3xl ${
                card.valueClassName || "text-white"
              }`}
            >
              {card.value}
            </h2>
          </div>
          <p className="mt-5 text-sm text-zinc-500">{card.helper}</p>
        </article>
      ))}
    </section>
  );
}

function MarketMoversSection({
  error,
  loading,
  movers,
  onQuickAdd,
  rates,
  selectedCurrency,
}: {
  error: string;
  loading: boolean;
  movers: MarketMovers;
  onQuickAdd: (asset: MarketMover) => void;
  rates: ExchangeRates;
  selectedCurrency: SupportedCurrency;
}) {
  const sections: Array<{
    key: "topGainers" | "topLosers" | "trendingCrypto";
    title: string;
    description: string;
    tone: "positive" | "negative";
  }> = [
    {
      key: "topGainers",
      title: "Top Gainers",
      description: "Strongest equity movers today",
      tone: "positive",
    },
    {
      key: "topLosers",
      title: "Top Losers",
      description: "Largest downside moves today",
      tone: "negative",
    },
    {
      key: "trendingCrypto",
      title: "Trending Crypto",
      description: "Crypto pairs moving right now",
      tone: "positive",
    },
  ];

  return (
    <section className="space-y-5">
      <SectionHeader
        eyebrow="Market watch"
        title="Market Movers"
        description="Free-tier live movers built from curated quote data and refreshed every 30 seconds."
      />

      {error && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {sections.map((section) => (
          <MarketMoverGroup
            key={section.key}
            description={section.description}
            error={movers.errors?.[section.key] || ""}
            loading={loading}
            movers={movers[section.key]}
            onQuickAdd={onQuickAdd}
            rates={rates}
            selectedCurrency={selectedCurrency}
            title={section.title}
            tone={section.tone}
            updatedAt={movers.updatedAt}
          />
        ))}
      </div>
    </section>
  );
}

function MarketMoverGroup({
  description,
  error,
  loading,
  movers,
  onQuickAdd,
  rates,
  selectedCurrency,
  title,
  tone,
  updatedAt,
}: {
  description: string;
  error: string;
  loading: boolean;
  movers: MarketMover[];
  onQuickAdd: (asset: MarketMover) => void;
  rates: ExchangeRates;
  selectedCurrency: SupportedCurrency;
  title: string;
  tone: "positive" | "negative";
  updatedAt?: string;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#101318] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            tone === "positive"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/20 bg-rose-500/10 text-rose-300"
          }`}
        >
          Live
        </span>
      </div>

      {updatedAt && (
        <p className="mb-4 text-xs text-zinc-600">
          Updated {new Date(updatedAt).toLocaleTimeString()}
        </p>
      )}

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-white/[0.04]"
            />
          ))}
        </div>
      )}

      {!loading && error && movers.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
          {error}
        </div>
      )}

      {!loading && !error && movers.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
          No movers available right now.
        </div>
      )}

      {!loading && movers.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {movers.map((asset) => (
            <MarketMoverCard
              key={`${title}-${asset.symbol}`}
              asset={asset}
              onQuickAdd={onQuickAdd}
              rates={rates}
              selectedCurrency={selectedCurrency}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function MarketMoverCard({
  asset,
  onQuickAdd,
  rates,
  selectedCurrency,
}: {
  asset: MarketMover;
  onQuickAdd: (asset: MarketMover) => void;
  rates: ExchangeRates;
  selectedCurrency: SupportedCurrency;
}) {
  const isPositive = asset.percentChange >= 0;
  const convertedPrice = convertCurrency(
    asset.price,
    getMarketMoverCurrency(asset),
    selectedCurrency,
    rates
  );

  return (
    <button
      onClick={() => onQuickAdd(asset)}
      className="group rounded-2xl border border-white/10 bg-[#080A0F] p-4 text-left transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#11151C]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-white">
              {asset.symbol.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-white">
                {asset.name}
              </h4>
              <p className="mt-1 text-xs text-zinc-500">{asset.symbol}</p>
            </div>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${assetTypeClasses(
            asset.type
          )}`}
        >
          {asset.type}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">Last Price</p>
          <p className="mt-1 text-base font-semibold text-white">
            {formatCurrency(convertedPrice, selectedCurrency)}
          </p>
        </div>

        <div className="text-right">
          <p
            className={`text-sm font-semibold ${
              isPositive ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(asset.percentChange).toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {isPositive ? "+" : ""}
            {asset.change.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-zinc-500">
        <span>Quick add</span>
        <span className="transition group-hover:translate-x-1 group-hover:text-white">
          →
        </span>
      </div>
    </button>
  );
}

function InvestmentsSection({
  investments,
  loading,
  rates,
  selectedCurrency,
  onDelete,
}: {
  investments: Investment[];
  loading: boolean;
  rates: ExchangeRates;
  selectedCurrency: SupportedCurrency;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Holdings"
        title="Investments"
        description="Live values update from the latest available market price."
      />

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-[#101318] p-6 text-zinc-400">
          Loading investments...
        </div>
      )}

      {!loading && investments.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-[#101318] p-8">
          <h2 className="text-xl font-semibold text-white">
            No investments yet
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            Add your first stock or crypto holding to see live prices,
            allocation, and profit/loss.
          </p>
        </div>
      )}

      {!loading && investments.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {investments.map((investment) => (
            <InvestmentCard
              key={investment._id}
              investment={investment}
              rates={rates}
              selectedCurrency={selectedCurrency}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function InvestmentCard({
  investment,
  rates,
  selectedCurrency,
  onDelete,
}: {
  investment: Investment;
  rates: ExchangeRates;
  selectedCurrency: SupportedCurrency;
  onDelete: (id: string) => void;
}) {
  const baseCurrency = getInvestmentBaseCurrency(investment);
  const buyPrice = convertCurrency(
    investment.buyPrice,
    baseCurrency,
    selectedCurrency,
    rates
  );
  const livePrice = convertCurrency(
    investment.currentPrice || 0,
    baseCurrency,
    selectedCurrency,
    rates
  );
  const investedAmount = investment.quantity * buyPrice;
  const currentValue = investment.quantity * livePrice;
  const profitLoss = currentValue - investedAmount;
  const profitLossPercentage =
    investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;
  const isProfit = profitLoss >= 0;

  return (
    <article className="rounded-3xl border border-white/10 bg-[#101318] p-5 sm:p-6">
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      <h2 className="truncate text-xl font-semibold tracking-tight text-white">
        {investment.assetName}
      </h2>
      <p className="mt-1 text-sm uppercase text-zinc-400">
        {investment.symbol}
      </p>
    </div>

    <div className="flex flex-col items-end gap-2">
      <span
        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize ${assetTypeClasses(
          investment.type
        )}`}
      >
        {investment.type}
      </span>

      <button
        type="button"
        onClick={() => onDelete(investment._id)}
        className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
      >
        Delete
      </button>
    </div>
  </div>

  <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
    <Metric
      label="Quantity"
      value={investment.quantity.toString()}
    />

    <Metric
      label="Buy Price"
      value={formatCurrency(
        buyPrice,
        selectedCurrency
      )}
    />

    <Metric
      label="Live Price"
      value={formatCurrency(
        livePrice,
        selectedCurrency
      )}
    />
  </div>

  <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
    <Metric
      label="Invested"
      value={formatCurrency(
        investedAmount,
        selectedCurrency
      )}
    />

    <Metric
      label="Current"
      value={formatCurrency(
        currentValue,
        selectedCurrency
      )}
    />

    <div className="rounded-2xl bg-white/[0.03] p-4">
      <p className="text-sm text-zinc-500">
        Profit / Loss
      </p>

      <p
        className={`mt-2 text-lg font-semibold ${
          isProfit
            ? "text-emerald-300"
            : "text-rose-300"
        }`}
      >
        {isProfit ? "+" : ""}
        {formatCurrency(
          profitLoss,
          selectedCurrency
        )}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {isProfit ? "+" : ""}
        {profitLossPercentage.toFixed(2)}%
      </p>
    </div>
  </div>
</article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-base font-semibold text-zinc-100">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function AddInvestmentModal({
  assetName,
  buyPrice,
  currentPrice,
  currentPriceCurrency,
  onAssetNameChange,
  onBuyPriceChange,
  onClose,
  onQuantityChange,
  onSearch,
  onSelectResult,
  onSubmit,
  onSymbolChange,
  onTypeChange,
  quantity,
  search,
  searchLoading,
  searchResults,
  symbol,
  type,
  rates,
  selectedCurrency,
}: {
  assetName: string;
  buyPrice: string;
  currentPrice: number | null;
  currentPriceCurrency: SupportedCurrency;
  onAssetNameChange: (value: string) => void;
  onBuyPriceChange: (value: string) => void;
  onClose: () => void;
  onQuantityChange: (value: string) => void;
  onSearch: (value: string) => void;
  onSelectResult: (item: SearchResult) => void;
  onSubmit: (event: React.FormEvent) => void;
  onSymbolChange: (value: string) => void;
  onTypeChange: (value: AssetType) => void;
  quantity: string;
  search: string;
  searchLoading: boolean;
  searchResults: SearchResult[];
  symbol: string;
  type: AssetType;
  rates: ExchangeRates;
  selectedCurrency: SupportedCurrency;
}) {
  const convertedLivePrice =
    currentPrice === null
      ? null
      : convertCurrency(
          currentPrice,
          currentPriceCurrency,
          selectedCurrency,
          rates
        );
  const estimatedValue =
  Number(quantity || 0) *
  (currentPrice !== null
    ? convertCurrency(
        currentPrice,
        currentPriceCurrency,
        selectedCurrency,
        rates
      )
    : Number(buyPrice || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-[#101318] p-5 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Add Investment
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Search an asset, confirm the symbol, and add your holding.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <label className="mb-2 block text-sm text-zinc-400">
              Search asset
            </label>
            <input
              type="text"
              placeholder="Search stocks or crypto"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#080A0F] px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/50"
            />

            {(searchResults.length > 0 || searchLoading) && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#101318] shadow-2xl">
                {searchLoading && (
                  <div className="px-4 py-3 text-sm text-zinc-400">
                    Searching...
                  </div>
                )}

                {searchResults.map((item) => (
                  <button
                    type="button"
                    key={`${item.symbol}-${item.instrument_name}`}
                    onClick={() => onSelectResult(item)}
                    className="w-full border-b border-white/10 px-4 py-4 text-left transition last:border-b-0 hover:bg-white/[0.04]"
                  >
                    <div className="font-medium text-white">
                      {item.instrument_name}
                    </div>
                    <div className="mt-1 text-sm text-zinc-400">
                      {item.symbol}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Asset Name"
              placeholder="Asset name"
              value={assetName}
              onChange={onAssetNameChange}
            />

            <FormInput
              label="Symbol"
              placeholder="Symbol"
              value={symbol}
              onChange={onSymbolChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Type</span>
              <select
                value={type}
                onChange={(event) => onTypeChange(event.target.value as AssetType)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#080A0F] px-4 text-white outline-none transition focus:border-emerald-400/50"
              >
                <option value="stock">Stock</option>
                <option value="crypto">Crypto</option>
              </select>
            </label>

            <FormInput
              label="Quantity"
              placeholder="Quantity"
              type="number"
              value={quantity}
              onChange={onQuantityChange}
            />

            <FormInput
              label="Buy Price"
              placeholder="Buy price"
              type="number"
              value={buyPrice}
              onChange={onBuyPriceChange}
            />
            {currentPrice !== null && (
  <p className="mt-2 text-xs text-zinc-500">
    Current market price:{" "}
    {formatCurrency(
      convertCurrency(
        currentPrice,
        currentPriceCurrency,
        selectedCurrency,
        rates
      ),
      selectedCurrency
    )}
  </p>
)}
          </div>

          {currentPrice !== null && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <p className="text-sm text-emerald-200">Live Market Price</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">
                {formatCurrency(convertedLivePrice || 0, selectedCurrency)}
              </h3>
            </div>
          )}
          {Number(quantity) > 0 && (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <p className="text-sm text-zinc-400">
      Estimated Investment Value
    </p>

    <h3 className="mt-1 text-xl font-semibold text-white">
      {formatCurrency(
        estimatedValue,
        selectedCurrency
      )}
    </h3>
  </div>
)}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              className="h-12 flex-1 rounded-2xl bg-white font-semibold text-black transition hover:bg-zinc-200"
            >
              Save Investment
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border border-white/10 text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.03]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormInput({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-zinc-400">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-white/10 bg-[#080A0F] px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/50"
      />
    </label>
  );
}
