const express = require("express");
const {
  getEndpoints,
  endpointNotFound,
} = require("./controllers/endpoints.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticle,
  getAllArticles,
} = require("./controllers/articles.controller");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.all("*", endpointNotFound);

app.use((err, req, res, next) => {
  const { msg, status } = err;
  if (msg && status) {
    res.status(status).send({ msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const { code } = err;
  if (code) {
    //property called 'code' is from error generated by sql
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("there is an error 500=======>\n", err);
  res.status(500).send({ error: "Internal server error" });
});

module.exports = app;
