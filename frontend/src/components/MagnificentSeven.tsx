import { useEffect, useState } from "react";
import "./MagnificentSeven.css";

interface StockBlock {
  symbol: string;
  name: string;
  price: string;
  color: string;
}

interface MagnificentSevenProps {
  onSelectStock: (ticker: { symbol: string; name: string; price: string }) => void;
}

export const MagnificentSeven = ({ onSelectStock }: MagnificentSevenProps) => {
  const [stocks, setStocks] = useState<StockBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const stocksInfo = [
    { symbol: "AAPL", name: "Apple Inc.", color: "#000000" },
    { symbol: "MSFT", name: "Microsoft", color: "#00A4EF" },
    { symbol: "GOOGL", name: "Alphabet", color: "#4285F4" },
    { symbol: "AMZN", name: "Amazon", color: "#FF9900" },
    { symbol: "NVDA", name: "NVIDIA", color: "#76B900" },
    { symbol: "META", name: "Meta", color: "#0668E1" },
    { symbol: "TSLA", name: "Tesla", color: "#CC0000" }
  ];

  useEffect(() => {
    const fetchStockPrices = async () => {
      setLoading(true);
      try {
        const stocksWithPrices = await Promise.all(
          stocksInfo.map(async (stock) => {
            try {
              const response = await fetch(
                `http://localhost:8000/api/company/symbol?symbol=${stock.symbol}`
              );
              if (response.ok) {
                const data = await response.json();
                return {
                  ...stock,
                  price: data.currentprice.toFixed(2)
                };
              }
              return { ...stock, price: "N/A" };
            } catch (error) {
              console.error(`Error fetching ${stock.symbol}:`, error);
              return { ...stock, price: "N/A" };
            }
          })
        );
        setStocks(stocksWithPrices);
      } catch (error) {
        console.error("Error fetching stock prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockPrices();
  }, []);

  const handleStockClick = (stock: StockBlock) => {
    onSelectStock({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price
    });
  };

  if (loading) {
    return (
      <div className="mag-seven-container">
        <div className="loading-message">Loading Magnificent Seven stocks...</div>
      </div>
    );
  }

  return (
    <div className="mag-seven-container">
      <h2 className="mag-seven-title">Magnificent Seven</h2>
      <div className="stock-blocks-grid">
        {stocks.map((stock) => (
          <div 
            key={stock.symbol} 
            className="stock-block"
            onClick={() => handleStockClick(stock)}
            style={{ cursor: 'pointer' }}
          >
            <div className="stock-header" style={{ backgroundColor: stock.color }}>
              <span className="stock-symbol">{stock.symbol}</span>
            </div>
            <div className="stock-content">
              <div className="stock-name">{stock.name}</div>
              <div className="stock-price">
                {stock.price === "N/A" ? "N/A" : `$${stock.price}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};