const {
  selectArticle,
  selectAllArticles,
  updateArticle,
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
