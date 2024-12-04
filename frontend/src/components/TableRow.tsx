import "./TableRow.css"

interface TableRowProps {
    ticker: string;
    volume: number;
    marketcap: number;
    high: number;
    price: number;
}

export const TableRow = ({ticker, volume, marketcap, high, price}: TableRowProps) => {
    return (
        <><div className="row-container"></div></>
    )
}