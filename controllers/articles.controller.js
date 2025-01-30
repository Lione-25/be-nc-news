const {
  selectArticle,
  selectAllArticles,
  updateArticle,
  insertArticle,
} = require("../models/articles.model");

exports.getArticle = ({ params }, res, next) => {
  selectArticle(params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = ({ query }, res, next) => {
  selectAllArticles(query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = ({ params, body }, res, next) => {
  updateArticle(params, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = ({ body }, res, next) => {
  insertArticle(body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
