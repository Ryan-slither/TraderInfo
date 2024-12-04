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
  return (
    <>
      <div className="row-container">
        <div className="row-element">{ticker}</div>
        <div className="row-element">{volume}</div>
        <div className="row-element">{marketcap}</div>
        <div className="row-element">{high}</div>
        <div className="row-element">{price}</div>
      </div>
    </>
  );
};
