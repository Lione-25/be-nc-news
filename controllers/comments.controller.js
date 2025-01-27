const { selectComments, insertComment } = require("../models/comments.model");

exports.getComments = ({ params }, res, next) => {
  selectComments(params)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = ({ body, params }, res, next) => {
  insertComment(body, params)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
