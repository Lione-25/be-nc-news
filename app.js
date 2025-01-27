const express = require("express");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  const { msg, status } = err;
  if (msg && status) {
    res.status(status).send({ msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("there is an error 500=======>\n", err);
  res.status(500).send({ error: "Internal server error" });
});

module.exports = app;
