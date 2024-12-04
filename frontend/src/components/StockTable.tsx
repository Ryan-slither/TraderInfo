import { useEffect, useState } from "react";
import "./StockTable.css";
import { TableRow } from "./TableRow";
import { initialStocks } from "../stocks";

interface StockTableTypes {
  ticker: string;
  volume: number;
  marketcap: number;
  high: number;
  price: number;
}

const quickSort = <T,>(array: T[], key: keyof T): T[] => {
  if (array.length <= 1) return array;

  const pivotIndex = Math.floor(array.length / 2);
  const pivot = array[pivotIndex];

  const left: T[] = [];
  const right: T[] = [];

  for (let i = 0; i < array.length; i++) {
    if (i === pivotIndex) continue;
    if (array[i][key] < pivot[key]) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }

  return [...quickSort(left, key), pivot, ...quickSort(right, key)];
};

const heapSort = <T,>(array: T[], key: keyof T): T[] => {
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, key);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    heapify(array, i, 0, key);
  }

  return array;
};

const heapify = <T,>(
  array: T[],
  heapSize: number,
  rootIndex: number,
  key: keyof T
): void => {
  let largest = rootIndex;
  const leftChild = 2 * rootIndex + 1;
  const rightChild = 2 * rootIndex + 2;

  if (leftChild < heapSize && array[leftChild][key] > array[largest][key]) {
    largest = leftChild;
  }

  if (rightChild < heapSize && array[rightChild][key] > array[largest][key]) {
    largest = rightChild;
  }

  if (largest !== rootIndex) {
    [array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
    heapify(array, heapSize, largest, key);
  }
};

export const StockTable = () => {
  const [stocks, setStocks] = useState<StockTableTypes[]>([]);
  const [sortMethod, setSortMethod] = useState(0);
  const [sortCurrent, setSortCurrent] = useState("");
  const [originalStocks, setOriginalStocks] = useState<StockTableTypes[]>([]);
  const [quickSortTime, setQuickSortTime] = useState<number>(0);
  const [heapSortTime, setHeapSortTime] = useState<number>(0);

  useEffect(() => {
    console.log("FUTURE API CALL");
    setStocks(initialStocks);
    setOriginalStocks(initialStocks);
  }, []);

  useEffect(() => {
    if (sortCurrent) {
      const key = sortCurrent as keyof StockTableTypes;

      if (sortMethod === 0) {
        setStocks([...originalStocks]);
        return;
      }

      const iterations = 1000;
      let quickSortTotalTime = 0;
      let heapSortTotalTime = 0;

      for (let i = 0; i < iterations; i++) {
        const quickSortStart = performance.now();
        quickSort([...originalStocks], key);
        const quickSortEnd = performance.now();
        quickSortTotalTime += quickSortEnd - quickSortStart;

        const heapSortStart = performance.now();
        heapSort([...originalStocks], key);
        const heapSortEnd = performance.now();
        heapSortTotalTime += heapSortEnd - heapSortStart;
      }

      const averageQuickSortTime = quickSortTotalTime / iterations;
      const averageHeapSortTime = heapSortTotalTime / iterations;

      setQuickSortTime(averageQuickSortTime);
      setHeapSortTime(averageHeapSortTime);

      const sortedStocks =
        sortMethod === 1
          ? quickSort([...originalStocks], key)
          : sortMethod === 2
          ? quickSort([...originalStocks], key).reverse()
          : [...originalStocks];

      setStocks(sortedStocks);
    }
  }, [sortCurrent, sortMethod, originalStocks]);

  const setSorted = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.target as HTMLDivElement;
    if (target.id === sortCurrent) {
      if (sortMethod === 2) {
        setSortMethod(0);
      } else {
        setSortMethod(sortMethod + 1);
      }
    } else {
      setSortCurrent(target.id);
      setSortMethod(1);
    }
  };

  const getArrow = () => {
    if (sortMethod === 0) {
      return "↑ ↓";
    } else if (sortMethod === 1) {
      return "↑  ";
    } else {
      return "  ↓";
    }
  };

  const getPerformanceMessage = () => {
    if (quickSortTime > heapSortTime) {
      const percentDifference = (
        ((quickSortTime - heapSortTime) / quickSortTime) *
        100
      ).toFixed(2);
      return `Heap Sort is faster by ${percentDifference}%`;
    } else if (heapSortTime > quickSortTime) {
      const percentDifference = (
        ((heapSortTime - quickSortTime) / heapSortTime) *
        100
      ).toFixed(2);
      return `Quick Sort is faster by ${percentDifference}%`;
    } else {
      return "Both sorting algorithms have the same performance";
    }
  };

  return (
    <>
      <div className="table-container">
        <div className="table-title">Stocks</div>
        <div className="sort-times">
          <div>Quick Sort Time: {quickSortTime.toFixed(5)} ms</div>
          <div>{getPerformanceMessage()}</div>
          <div>Heap Sort Time: {heapSortTime.toFixed(5)} ms</div>
        </div>

        <div className="table-rows">
          <div className="table-headers">
            <div className="header" id="ticker" onClick={setSorted}>
              ticker {(sortCurrent == "ticker" && getArrow()) || "↑ ↓"}
            </div>
            <div className="header" id="volume" onClick={setSorted}>
              volume {(sortCurrent == "volume" && getArrow()) || "↑ ↓"}
            </div>
            <div className="header" id="marketcap" onClick={setSorted}>
              market cap {(sortCurrent == "marketcap" && getArrow()) || "↑ ↓"}
            </div>
            <div className="header" id="high" onClick={setSorted}>
              high {(sortCurrent == "high" && getArrow()) || "↑ ↓"}
            </div>
            <div className="header" id="price" onClick={setSorted}>
              price {(sortCurrent == "price" && getArrow()) || "↑ ↓"}
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
        </div>
      </div>
    </>
  );
};
