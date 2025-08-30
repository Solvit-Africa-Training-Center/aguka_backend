# setup

<p align="center">
  <a href="https://expressjs.com/" target="blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width="200" alt="Express Logo" />
  </a>
</p>

## Badges

[![Coverage Status](https://coveralls.io/repos/github/Solvit-Africa-Training-Center/aguka_backend/badge.svg)](https://coveralls.io/github/Solvit-Africa-Training-Center/aguka_backend)

[![Maintainability](https://qlty.sh/gh/Solvit-Africa-Training-Center/projects/aguka_backend/maintainability.svg)](https://qlty.sh/gh/Solvit-Africa-Training-Center/projects/aguka_backend)

[![Code Coverage](https://qlty.sh/gh/Solvit-Africa-Training-Center/projects/aguka_backend/coverage.svg)](https://qlty.sh/gh/Solvit-Africa-Training-Center/projects/aguka_backend)

---

# Express + Sequelize + PostgreSQL API

A RESTful API built with **Node.js**, **Express**, **Sequelize ORM**, and **PostgreSQL**.  
An Aguka project backend web applicatin to monitor and digitize the people coopeartives and association, management and automation. Easy finance and smart system

---

## Features

- **Validation** with Joi
- **File Uploads** (Cloudinary)
- **Email Notifications** with Nodemailer
- **Swagger API Documentation**
- **Testing** with Jest & Supertest
- **CI/CD Integration** (Travis CI, Coveralls, CodeClimate)

---

## Tech Stack

- **Node.js + Express**
- **Sequelize ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Jest & Supertest** (testing)
- **Swagger (OpenAPI)**

---

## Installation

```bash
# clone repo
git clone https://github.com/Solvit-Africa-Training-Center/aguka_backend.git
cd aguka_backend

# install dependencies
npm install

# setup database
npx sequelize db:create
npx sequelize db:migrate

# start dev server
npm run dev
```
