import "./TableRow.css";

interface TableRowProps {
  ticker: string;
  volume: number;
  marketcap: number;
  high: number;
  price: number;
}

export const TableRow = ({
  ticker,
  volume,
  marketcap,
  high,
  price,
}: TableRowProps) => {
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toString();
  };

  return (
    <div className="row-container">
      <div className="row-element">{ticker}</div>
      <div className="row-element">{formatVolume(volume)}</div>
      <div className="row-element">{formatMarketCap(marketcap)}</div>
      <div className="row-element">${high}</div>
      <div className="row-element">${price}</div>
    </div>
  );
};
