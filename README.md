# Northcoders News API

[View the hosted version of this project here](https://nc-news-kqpq.onrender.com/api)

## Setup

To run this project locally:

Clone the repository `$ git clone https://github.com/Lione-25/be-nc-news`

Navigate into the repository `$ cd be-nc-news`

Install dependencies `$ npm install`

Change the database names in the db/setup.sql file.

Setup local databases using the setup-dbs script `$ npm run setup-dbs`

Create the following files:

- `.env.development` with the contents `PGDATABASE=[Your development database name here]`
- `.env.test` with the contents `PGDATABASE=[Your test database name here]`

These will allow you to connect to your databases locally.

Seed your local development database using the seed script `$ npm run seed`

Run tests using the test script `$ npm run test`

You will need Node.js version 23.3.0 and PostgreSQL version 16.6 installed in order to run this project successfully.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
