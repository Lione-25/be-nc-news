const express = require("express");

const { getEndpoints } = require("./controllers/endpoints.controller");

const app = express();

app.get("/api", getEndpoints);

app.use((err, req, res, next) => {
  console.log("there is an error 500=======>\n", err);
  res.status(500).send({ error: "Internal server error" });
});

module.exports = app;
