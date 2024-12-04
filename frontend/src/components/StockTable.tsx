import { useEffect, useState } from "react";
import "./StockTable.css";
import { TableRow } from "./TableRow";

interface StockTableTypes {
  ticker: string;
  volume: number;
  marketcap: number;
  high: number;
  price: number;
}

export const StockTable = () => {
  const [stocks, setStocks] = useState<StockTableTypes[]>([]);
  //const [sortMethod, setSortMethod] = useState(0);
  //const [sortCurrent, setSortCurrent] = useState("");

  useEffect(() => {
    console.log("FUTURE API CALL");
    setStocks((prev) => [
      ...prev,
      {
        ticker: "AAPL",
        volume: 89012345,
        marketcap: 2500000000000,
        high: 175.23,
        price: 172.5,
      },
      {
        ticker: "TSLA",
        volume: 67234021,
        marketcap: 850000000000,
        high: 240.5,
        price: 235.75,
      },
      {
        ticker: "MSFT",
        volume: 45123087,
        marketcap: 2200000000000,
        high: 335.1,
        price: 330.89,
      },
    ]);
  }, [setStocks]);

  const setSorted = () => {
    console.log("sort");
  };

  return (
    <>
      <div className="table-container">
        <div className="table-title">Stocks</div>
        <div className="table-rows">
          <div className="table-headers">
            <div className="header" onClick={setSorted}>
              ticker ↑ ↓
            </div>
            <div className="header" onClick={setSorted}>
              volume ↑ ↓
            </div>
            <div className="header" onClick={setSorted}>
              market cap ↑ ↓
            </div>
            <div className="header" onClick={setSorted}>
              high ↑ ↓
            </div>
            <div className="header" onClick={setSorted}>
              price ↑ ↓
            </div>
          </div>
          {stocks.map((stock, index) => {
            return (
              <TableRow
                key={index}
                ticker={stock.ticker}
                volume={stock.volume}
                marketcap={stock.marketcap}
                high={stock.high}
                price={stock.price}
              />
            );
          })}
          {stocks.map((stock, index) => {
            return (
              <TableRow
                key={index + 3}
                ticker={stock.ticker}
                volume={stock.volume}
                marketcap={stock.marketcap}
                high={stock.high}
                price={stock.price}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
