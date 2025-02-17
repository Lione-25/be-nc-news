const express = require("express");

const cors = require("cors");

const apiRouter = require("./routes/api-router");

const { endpointNotFound } = require("./controllers/endpoints.controller");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", endpointNotFound);

app.use((err, req, res, next) => {
  const { msg, status } = err;
  if (msg && status) {
    res.status(status).send({ error: msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const { code } = err;
  if (code) {
    //property called 'code' is from error generated by sql
    res.status(400).send({ error: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("there is an error 500=======>\n", err);
  res.status(500).send({ error: "Internal server error" });
});

module.exports = app;
