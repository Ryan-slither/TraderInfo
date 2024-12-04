import './TickerCard.css';


interface Ticker {
 symbol: string;
 name: string;
 price: string;
}


interface TickerCardProps {
 ticker: Ticker;
 onClick: (ticker: Ticker) => void;
}

export const TickerCard = ({ ticker, onClick }: TickerCardProps) => {
 return (
   <div className="ticker-card" onClick={() => onClick(ticker)}>
     <div className="ticker-content">
       <div className="ticker-info">
         <h3 className="ticker-symbol">{ticker.symbol}</h3>
         <p className="ticker-name">{ticker.name}</p>
       </div>
       <div className="ticker-price-info">
         <p className="ticker-price">${ticker.price}</p>
       </div>
     </div>
   </div>
 );
};