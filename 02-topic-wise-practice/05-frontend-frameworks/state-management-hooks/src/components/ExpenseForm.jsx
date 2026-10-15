import { useState, useContext, useRef } from 'react';
import { ExpenseContext } from '../ExpenseContext';

function ExpenseForm() {
  const { dispatch } = useContext(ExpenseContext);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: '' });
  const [error, setError] = useState('');
  const titleRef = useRef(null); // useRef to move focus back after adding

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) {
      setError('Enter a title and an amount greater than 0.');
      return;
    }
    dispatch({
      type: 'ADD',
      payload: { ...form, amount: Number(form.amount), date: form.date || new Date().toISOString().slice(0, 10) }
    });
    setForm({ title: '', amount: '', category: form.category, date: '' });
    setError('');
    titleRef.current.focus();
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input ref={titleRef} name="title" placeholder="What did you spend on?" value={form.title} onChange={handleChange} />
      <input name="amount" type="number" placeholder="Amount (Rs)" value={form.amount} onChange={handleChange} />
      <select name="category" value={form.category} onChange={handleChange}>
        <option>Food</option>
        <option>Travel</option>
        <option>Study</option>
        <option>Other</option>
      </select>
      <input name="date" type="date" value={form.date} onChange={handleChange} />
      <button type="submit">Add</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default ExpenseForm;
