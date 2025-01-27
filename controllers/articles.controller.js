const { selectArticle } = require("../models/articles.model");

exports.getArticle = ({ params }, res, next) => {
  selectArticle(params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
