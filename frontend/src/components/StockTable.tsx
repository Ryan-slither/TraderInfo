import { useEffect, useState } from "react";
import "./StockTable.css";

export const StockTable = () => {
  return (
    <>
      <div className="table-container">
        <div className="table-title">Stocks</div>
        <div className="table-rows"></div>
      </div>
    </>
  );
};
