import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { StockChart } from "./components/StockChart";
import { TickerCard } from "./components/TickerCard";
import { StockTable } from "./components/StockTable";
import "./App.css";

interface StockData {
  date: string;
  value: number;
}

interface Ticker {
  symbol: string;
  name: string;
  price: string;
}

interface FinancialData {
  Symbol: string;
  MarketCapitalization: number;
  PERatio: number;
  Week52High: number;
  Week52Low: number;
  DividendYield: number;
  Beta: number;
  EPS: number;
  ProfitMargin: number;
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTicker, setSelectedTicker] = useState<Ticker | null>(null);
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Fetch symbols as user types
  useEffect(() => {
    const fetchSymbols = async () => {
      if (!searchQuery.trim()) {
        setTickers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/company/symbols?search=${searchQuery}`
        );
        if (response.ok) {
          const data = await response.json();
          // Fetch additional details for each symbol
          const tickersWithDetails = await Promise.all(
            data.symbols.map(async (symbol: string) => {
              try {
                const symbolResponse = await fetch(
                  `http://localhost:8000//api/company/symbol?symbol=${symbol}`
                );
                if (symbolResponse.ok) {
                  const symbolData = await symbolResponse.json();
                  return {
                    symbol: symbolData.symbol,
                    name: symbolData.shortname || symbolData.longname,
                    price: symbolData.currentprice.toFixed(2),
                  };
                }
                return null;
              } catch (error) {
                console.error(`Error fetching details for ${symbol}:`, error);
                return null;
              }
            })
          );

          setTickers(tickersWithDetails.filter(Boolean));
        }
      } catch (error) {
        console.error("Error fetching symbols:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(fetchSymbols, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch stock details and financial data when a ticker is selected
  useEffect(() => {
    const fetchStockData = async (symbol: string) => {
      try {
        // Fetch chart data
        const chartResponse = await fetch(
          `http://localhost:8000//api/stock?symbol=${symbol}`
        );
        if (chartResponse.ok) {
          const chartData = await chartResponse.json();
          setStockData(
            chartData.data.map((item: any) => ({
              date: item.date,
              value: parseFloat(item.close),
            }))
          );
        }

        // Fetch financial data
        const financialResponse = await fetch(
          `http://localhost:8000/api/financial/finances?symbol=${symbol}`
        );
        if (financialResponse.ok) {
          const data = await financialResponse.json();
          setFinancialData(data);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    if (selectedTicker) {
      fetchStockData(selectedTicker.symbol);
    } else {
      setFinancialData(null);
    }
  }, [selectedTicker]);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedTicker(null);
    setShowAbout(false);
  };

  const AboutPage = () => (
    <div className="about-page">
      <h2 className="about-title">About TraderInfo</h2>
      <div className="about-content">
        <p>
          TraderInfo is a comprehensive stock market information platform that provides
          real-time stock data and analysis tools for investors. Our platform integrates
          data from Alpha Vantage API and historical S&P 500 stock data to give you
          accurate and timely market insights.
        </p>
        <p>
          Features:<br />
          • Real-time stock price tracking<br />
          • Historical price data visualization<br />
          • Company information and key statistics<br />
          • User-friendly search interface
        </p>
        <p>
          Built with modern technologies including React, Node.js, MongoDB, and Docker,
          TraderInfo aims to provide a seamless experience for both novice and
          experienced investors.
        </p>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1
            className="logo cursor-pointer"
            onClick={handleReset}
          >
            TraderInfo
          </h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search stocks..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="search-icon cursor-pointer" size={20} />
          </div>
          <button
            className="about-button"
            onClick={() => {
              setShowAbout(true);
              setSelectedTicker(null);
              setSearchQuery("");
            }}
          >
            About
          </button>
        </div>
      </nav>
      {<StockTable/>}
      <main className="main-content">
        {showAbout ? (
          <AboutPage />
        ) : loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : !selectedTicker ? (
          <div className="stock-list">
            {tickers.map((ticker) => (
              <TickerCard
                key={ticker.symbol}
                ticker={ticker}
                onClick={setSelectedTicker}
              />
            ))}
            {searchQuery && tickers.length === 0 && (
              <div className="loading-message">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          <div className="detail-view">
            <div className="stock-detail-card">
              <div className="detail-header">
                <h2 className="main-content-title">
                  {selectedTicker.symbol} - {selectedTicker.name}
                </h2>
                <button
                  onClick={() => setSelectedTicker(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Back to Search
                </button>
              </div>
              <div className="stock-info">
                <span className="stock-price">${selectedTicker.price}</span>
              </div>
              <div className="chart-container">
                <StockChart data={stockData} />
              </div>
            </div>

            <div className="stock-detail-card">
              <h3 className="stat-header">Key Statistics</h3>
              <div className="stats-container">
                {financialData ? (
                  <>
                    <div className="stat-row">
                      <span className="stat-label">Market Cap</span>
                      <span className="stat-value">
                        {formatMarketCap(financialData.MarketCapitalization)}
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">P/E Ratio</span>
                      <span className="stat-value">
                        {financialData.PERatio.toFixed(2)}
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">52 Week High</span>
                      <span className="stat-value">
                        ${financialData.Week52High.toFixed(2)}
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">52 Week Low</span>
                      <span className="stat-value">
                        ${financialData.Week52Low.toFixed(2)}
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Dividend Yield</span>
                      <span className="stat-value">
                        {formatPercentage(financialData.DividendYield)}
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Beta</span>
                      <span className="stat-value">
                        {financialData.Beta.toFixed(2)}
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">EPS</span>
                      <span className="stat-value">
                        ${financialData.EPS.toFixed(2)}
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Profit Margin</span>
                      <span className="stat-value">
                        {formatPercentage(financialData.ProfitMargin)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">Loading statistics...</div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;