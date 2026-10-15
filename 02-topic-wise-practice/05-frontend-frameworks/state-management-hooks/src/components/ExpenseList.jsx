import { useContext } from 'react';
import { ExpenseContext } from '../ExpenseContext';

function ExpenseList({ items }) {
  const { dispatch } = useContext(ExpenseContext);

  if (items.length === 0) {
    return <p className="muted">No expenses to show.</p>;
  }

  return (
    <table className="list">
      <thead>
        <tr><th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th></th></tr>
      </thead>
      <tbody>
        {items.map(e => (
          <tr key={e.id}>
            <td>{e.date}</td>
            <td>{e.title}</td>
            <td>{e.category}</td>
            <td className="amount">Rs {e.amount}</td>
            <td><button className="link" onClick={() => dispatch({ type: 'DELETE', id: e.id })}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExpenseList;
