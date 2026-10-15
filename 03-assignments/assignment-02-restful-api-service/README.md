# Assignment 02 · RESTful API Service: Library Lending API
A REST API for a college library built with Express and MongoDB (Mongoose). It manages books, members and loans, checks borrowing limits and stock, and calculates late-return fines.

## Structure
```
src/
  server.js          starts the server after connecting to MongoDB
  app.js             Express app, routes and middleware
  config/db.js       MongoDB connection
  models/            Book, Member, Loan schemas with validation
  controllers/       request handlers
  routes/            URL to controller mapping
  middleware/        logger, ObjectId check, async wrapper, 404, error handler
  seed.js            sample books and members
  test-api.js        end-to-end API test
```

## Endpoints
| Method | URL | Description |
|---|---|---|
| GET | /api/books | List books. Query: `search`, `category`, `available=true`, `page`, `limit`, `sort` |
| GET | /api/books/:id | One book |
| POST | /api/books | Add a book |
| PUT | /api/books/:id | Update a book (keeps copies on loan consistent) |
| DELETE | /api/books/:id | Delete a book (blocked while on loan) |
| GET | /api/books/stats/categories | Titles and copies per category (aggregation) |
| GET / POST | /api/members | List / add members |
| GET / PUT / DELETE | /api/members/:id | One member |
| GET | /api/members/:id/loans | Borrowing history |
| GET | /api/loans?status= | List loans: Issued, Overdue or Returned |
| POST | /api/loans | Issue a book `{ bookId, memberId }` |
| PATCH | /api/loans/:id/return | Return a book and calculate the fine |

**Status codes used:** 200, 201, 400 (validation / bad id), 403 (inactive member), 404, 409 (duplicate, no copies, limit reached), 500.

## Run
1. Start MongoDB.
2. `cd src`, copy `.env.example` to `.env`.
3. `npm install`, then `npm run seed` and `npm start`.
4. In another terminal: `npm run test:api` runs the end-to-end tests against the running server.

The same requests can be sent from Postman; save the test screenshots in `screenshots/`.
