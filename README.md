# Booking 🛎

Sports facility reservation service

<br>

---

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Installation](#installation)
- [Tests](#tests)

  <br>

---

## General info

CRUD Application made with <a href="https://nestjs.com/" target="_blank">NestJS</a>, <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>, <a href="https://graphql.org/" target="_blank">GraphQL</a> and <a href="https://www.postgresq" target="_blank">PostgreSQL</a>

<a href="http://booking-nailseong.com" target="_blank">http://booking-nailseong.com</a>

![logged-in-home](./images/loggedInHome.png)

_<div align="center">Home page when logged in</div>_

## <br>

---

## Technologies

Project is created with:

**Backend**

- <a href="https://nestjs.com/" target="_blank">NestJS</a> v7.5.1
- <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> v4.0.5
- <a href="https://graphql.org/" target="_blank">GraphQL</a> v15.4.0
- <a href="https://jestjs.io/" target="_blank">Jest</a> v26.6.3
- <a href="https://www.postgresq" target="_blank">PostgreSQL</a> v13
- <a href="https://typeorm.io/#/" target="_blank">TypeORM</a> v0.2.29

  <br>

**Frontend** - https://github.com/naIlSeong/booking-frontend

- <a href="https://ko.reactjs.org/" target="_blank">React</a> v17.0.1
- <a href="https://graphql.org/" target="_blank">GraphQL</a> v15.4.0
- <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> v4.0.5
- <a href="https://www.apollographql.com/docs/react/" target="_blank">Apollo Client</a> v3.3.6
- <a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a> v2.0.2

 <br>

**Deploy**

- <a href="https://aws.amazon.com/ko/ec2/?ec2-whats-new.sort-by=item.additionalFields.postDateTime&ec2-whats-new.sort-order=desc" target="_blank">AWS EC2</a>
- <a href="https://www.nginx.com/" target="_blank">Nginx</a>

  <br>

---

## Installation

To run this project, install it locally using npm:

```
// First clone this repo and install dependencies
$ git clone https://github.com/naIlSeong/booking-api
$ cd booking-api
$ npm install
$ npm run start:dev
```

```
// Set environment variable

//.env.dev
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_DATABASE=booking
SALT=10
PRIVATE_KEY=yourPrivateKey
```

<br>

---

## Tests

To run test this project:

```
// Unit Test
$ npm run test:cov
```

![unit-test](./images/unit.png)
<br>

```
// End To End Test
$ npm run test:e2e
```

![e2e-test](./images/e2e.png)
