import { useContext, useMemo } from 'react';
import { ExpenseContext } from '../ExpenseContext';

function Summary() {
  const { expenses } = useContext(ExpenseContext);

  const { total, byCategory } = useMemo(() => {
    const byCategory = {};
    let total = 0;
    expenses.forEach(e => {
      total += e.amount;
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    return { total, byCategory };
  }, [expenses]);

  return (
    <div className="summary">
      <div className="total">Total spent: <strong>Rs {total}</strong></div>
      <div className="cats">
        {Object.entries(byCategory).map(([cat, amt]) => (
          <span key={cat}>{cat}: Rs {amt}</span>
        ))}
      </div>
    </div>
  );
}

export default Summary;
