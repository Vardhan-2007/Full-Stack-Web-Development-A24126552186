# MongoDB and Mongoose Practice
- `mongoose-schema-validation.js` - required, unique, regex `match`, `min`/`max`, `enum`, custom validators and timestamps. Inserts one valid and six invalid students and prints why each one fails.
- `aggregation-queries.js` - six pipelines on sample orders: `$group`, `$match`, `$project`, `$sort`, `$limit`, `$month`, `$push`, `$addToSet`, `$expr`, `$count`.

**Run:** start MongoDB locally, then `npm install`, `npm run validation` and `npm run aggregation`. Set `MONGO_URL` to use a different database.
