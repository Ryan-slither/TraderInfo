import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { StockChart } from './components/StockChart';
import { TickerCard } from './components/TickerCard';
import './App.css';

interface StockData {
  date: string;
  value: number;
}

interface Ticker {
  symbol: string;
  name: string;
  price: string;
  change: string;
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTicker, setSelectedTicker] = useState<Ticker | null>(null);
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch symbols as user types
  useEffect(() => {
    const fetchSymbols = async () => {
      if (!searchQuery.trim()) {
        setTickers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/company/symbols?search=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          // Fetch additional details for each symbol
          const tickersWithDetails = await Promise.all(
            data.symbols.map(async (symbol: string) => {
              try {
                const symbolResponse = await fetch(`/api/company/symbol?symbol=${symbol}`);
                if (symbolResponse.ok) {
                  const symbolData = await symbolResponse.json();
                  return {
                    symbol: symbolData.symbol,
                    name: symbolData.shortname || symbolData.longname,
                    price: symbolData.currentprice.toFixed(2),
                    change: '+0.00%' // You'll need to calculate this from historical data
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
        console.error('Error fetching symbols:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(fetchSymbols, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch stock details when a ticker is selected
  useEffect(() => {
    const fetchStockData = async (symbol: string) => {
      try {
        const response = await fetch(`/api/stock?symbol=${symbol}`);
        if (response.ok) {
          const data = await response.json();
          setStockData(data.data.map((item: any) => ({
            date: item.date,
            value: parseFloat(item.close)
          })));
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    if (selectedTicker) {
      fetchStockData(selectedTicker.symbol);
    }
  }, [selectedTicker]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">TraderInfo</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search stocks..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="search-icon cursor-pointer"
              size={20}
            />
          </div>
          <button className="about-button">About</button>
        </div>
      </nav>

      <main className="main-content">
        {loading ? (
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
              <div className="text-center p-4 text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          <div className="detail-view">
            <div className="stock-detail-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
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
                <span className={`stock-change ${
                  selectedTicker.change.startsWith('+') ? 'positive-change' : 'negative-change'
                }`}>
                  {selectedTicker.change}
                </span>
              </div>
              <div className="chart-container">
                <StockChart data={stockData} />
              </div>
            </div>

            <div className="stock-detail-card">
              <h3 className="text-xl font-bold mb-4">Key Statistics</h3>
              <div className="stats-container">
                <div className="stat-row">
                  <span className="stat-label">Market Cap</span>
                  <span className="stat-value">$2.84T</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">P/E Ratio</span>
                  <span className="stat-value">28.92</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">52 Week High</span>
                  <span className="stat-value">$182.34</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">52 Week Low</span>
                  <span className="stat-value">$124.17</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;