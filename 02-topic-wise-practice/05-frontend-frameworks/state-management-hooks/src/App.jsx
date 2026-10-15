import { useReducer, useEffect, useMemo, useState } from 'react';
import { ExpenseContext } from './ExpenseContext';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';

const initialExpenses = [
  { id: 1, title: 'Mess bill', amount: 2500, category: 'Food', date: '2026-10-01' },
  { id: 2, title: 'Bus pass', amount: 600, category: 'Travel', date: '2026-10-02' },
  { id: 3, title: 'Lab record book', amount: 150, category: 'Study', date: '2026-10-05' }
];

// useReducer keeps all the add/delete logic in one place
function expenseReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { ...action.payload, id: Date.now() }];
    case 'DELETE':
      return state.filter(e => e.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

function loadSaved() {
  try {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  } catch {
    return initialExpenses;
  }
}

function App() {
  const [expenses, dispatch] = useReducer(expenseReducer, undefined, loadSaved);
  const [filter, setFilter] = useState('All');

  // useEffect: save to localStorage whenever the list changes, and update the tab title
  useEffect(() => {
    try {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch {
      /* storage not available */
    }
    document.title = `Expenses (${expenses.length})`;
  }, [expenses]);

  // useMemo: only recompute the filtered list when expenses or filter change
  const visible = useMemo(
    () => (filter === 'All' ? expenses : expenses.filter(e => e.category === filter)),
    [expenses, filter]
  );

  return (
    // useContext: child components read expenses and dispatch without prop drilling
    <ExpenseContext.Provider value={{ expenses, dispatch }}>
      <div className="app">
        <h1>Student Expense Tracker</h1>
        <Summary />
        <ExpenseForm />
        <div className="filter">
          <label htmlFor="filter">Show: </label>
          <select id="filter" value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Study</option>
            <option>Other</option>
          </select>
          <button className="link" onClick={() => dispatch({ type: 'CLEAR' })}>Clear all</button>
        </div>
        <ExpenseList items={visible} />
      </div>
    </ExpenseContext.Provider>
  );
}

export default App;
