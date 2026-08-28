import React from 'react';

interface StockBadgeProps {
  stock: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  if (stock <= 0) {
    return (
      <span className="badge badge-danger">
        <span className="stock-dot out-of-stock" /> Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="badge badge-warning">
        <span className="stock-dot low-stock" /> Only {stock} left!
      </span>
    );
  }

  return (
    <span className="badge badge-success">
      <span className="stock-dot in-stock" /> In Stock ({stock})
    </span>
  );
};
