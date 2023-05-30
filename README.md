# BCA Kurs API

The "BCA Kurs API" repository is a project aimed at scraping exchange rates from BCA (Bank Central Asia) and storing the data in a database. It provides an API for retrieving up-to-date exchange rates from BCA.

Features:

- Scraping: The project includes scraping functionality to fetch the latest exchange rates from BCA. This is achieved by using web scraping techniques to extract the required data from the BCA website.

- Database Storage: The scraped exchange rate data is stored in a database to allow easy retrieval and management. The repository utilizes a database system (e.g., MySQL, PostgreSQL) to persist the exchange rate information.

- API: The project provides an API endpoint for retrieving the exchange rates. This allows users to access the latest exchange rate data through HTTP requests.

## Tech Stack

Expressjs, Prisma, Mocha & Chai, Mysql, Docker

## Run Locally

Clone the project

```bash
  https://github.com/underworld14/bca-kurs-api
```

Go to the project directory

```bash
  cd bca-kurs-api
```

Install dependencies

```bash
  npm install
```

Prepare development environment variables

```bash
  cp .env.example .env
```

Boil up the database using docker compose

```bash
  docker compose up -d
  npx prisma db push
  npx prisma generate
```

Start the project development

```bash
  npm run dev
```

## Running Tests

To run tests, run the following command

```bash
    npm run test
```

## Build

To build this project run

```bash
    npm run build
```

Start The Project

```bash
    npm run start
```

## Documentation

[Postman API Collection](https://github.com/underworld14/bca-kurs-api/blob/main/documentation/Kurs%20API.postman_collection.json)
