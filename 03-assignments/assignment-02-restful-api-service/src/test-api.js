// End-to-end API test. Start the server first (npm start), then run: npm run test:api
// Uses the built-in fetch in Node 18+. It creates its own test data and removes it at the end.
const BASE = process.env.API_URL || 'http://localhost:5000/api';
let passed = 0, failed = 0;

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  let json = null;
  try { json = await res.json(); } catch { /* no body */ }
  return { status: res.status, json };
}

function check(name, condition, extra = '') {
  if (condition) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name} ${extra}`); }
}

(async () => {
  const stamp = Date.now().toString().slice(-6);
  const isbn = `9789999${stamp}`;
  console.log(`Testing ${BASE}\n`);

  let r = await call('GET', '');
  check('API index responds', r.status === 200);

  r = await call('POST', '/books', { isbn, title: 'Test Book', author: 'Tester', category: 'Programming', totalCopies: 1 });
  check('create book -> 201', r.status === 201, JSON.stringify(r.json));
  const bookId = r.json?.data?._id;
  check('new book has all copies available', r.json?.data?.availableCopies === 1);

  r = await call('POST', '/books', { isbn, title: 'Duplicate', author: 'X', totalCopies: 1 });
  check('duplicate ISBN -> 409', r.status === 409);

  r = await call('POST', '/books', { isbn: '123', title: '', author: 'X', totalCopies: 0 });
  check('invalid book -> 400', r.status === 400);

  r = await call('GET', '/books?search=test%20book');
  check('search finds the book', r.json?.data?.some(b => b._id === bookId));

  r = await call('GET', '/books/not-an-id');
  check('bad id -> 400', r.status === 400);

  r = await call('POST', '/members', { rollNo: `T${stamp}`, name: 'Test Student', email: `t${stamp}@mail.com`, maxBooks: 1 });
  check('create member -> 201', r.status === 201, JSON.stringify(r.json));
  const memberId = r.json?.data?._id;

  r = await call('POST', '/members', { rollNo: `U${stamp}`, name: 'Other Student', email: `u${stamp}@mail.com` });
  const otherId = r.json?.data?._id;

  r = await call('POST', '/loans', { bookId, memberId });
  check('issue book -> 201', r.status === 201, JSON.stringify(r.json));
  const loanId = r.json?.data?._id;
  check('loan status is Issued', r.json?.data?.status === 'Issued');

  r = await call('GET', `/books/${bookId}`);
  check('available copies drop to 0', r.json?.data?.availableCopies === 0);

  r = await call('POST', '/loans', { bookId, memberId: otherId });
  check('no copies left -> 409', r.status === 409);

  r = await call('DELETE', `/books/${bookId}`);
  check('cannot delete book on loan -> 409', r.status === 409);

  r = await call('GET', `/members/${memberId}/loans`);
  check('member history has 1 loan', r.json?.count === 1);

  r = await call('PATCH', `/loans/${loanId}/return`);
  check('return book -> 200, no fine', r.status === 200 && r.json?.data?.fine === 0);

  r = await call('PATCH', `/loans/${loanId}/return`);
  check('second return -> 409', r.status === 409);

  r = await call('PUT', `/books/${bookId}`, { totalCopies: 3, title: 'Test Book (2nd ed)' });
  check('update book copies and title', r.json?.data?.availableCopies === 3 && r.json?.data?.title === 'Test Book (2nd ed)');

  r = await call('GET', '/books/stats/categories');
  check('category stats returned', r.status === 200 && Array.isArray(r.json?.data));

  r = await call('GET', '/nothing-here');
  check('unknown route -> 404', r.status === 404);

  // Clean up test data
  await call('DELETE', `/members/${memberId}`);
  await call('DELETE', `/members/${otherId}`);
  r = await call('DELETE', `/books/${bookId}`);
  check('delete book -> 200', r.status === 200);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch(err => {
  console.error('Could not reach the API. Is the server running?', err.message);
  process.exit(1);
});
