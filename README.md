# Northcoders News API

Northcoders News API is a backend service built using Node.js, Express, and PostgreSQL, designed to simulate a real-world API similar to Reddit. This project provides a set of RESTful endpoints to programmatically access and manage data for topics, articles, comments, and users.

#### Key Features:
- Endpoints for retrieving and managing topics, articles, comments, and users.
- Advanced query functionality, including filtering, sorting, and pagination for articles.
- Designed with Test-Driven Development (TDD) to ensure robust and reliable functionality.
- High code quality maintained through Git workflows, feature branching, and Husky pre-commit hooks.
This project demonstrates backend development skills, database management, and RESTful API design, providing a strong foundation for scalable and maintainable applications.

[View the hosted version of this project here](https://nc-news-abj5.onrender.com/api)

To run this project locally, please refer to the following instructions:

## Installation

#### Clone the repository:

```
git clone https://github.com/Lione-25/be-nc-news
```

#### Navigate into the repository:

```
cd be-nc-news
```

#### Install dependencies:

```
npm install
```

## Setup

#### Change the database names in the db/setup.sql file.

#### Create local databases using the setup-dbs script:

```
npm run setup-dbs
```

#### Create the following files:

- `.env.development` with the contents `PGDATABASE=[Your development database name here]`
- `.env.test` with the contents `PGDATABASE=[Your test database name here]`

These will allow you to connect to your databases locally.

#### Seed your local development database using the seed script:

```
npm run seed
```

## Usage

#### Make use of the scripts provided in the package.JSON file, for example:

- Run tests using the test script:

  ```
  npm run test
  ```

- Host the project locally using the start script:

  ```
  npm run start
  ```


You will need Node.js version 23.3.0 and PostgreSQL version 16.6 installed in order to run this project successfully.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
