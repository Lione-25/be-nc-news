const {
  selectComments,
  insertComment,
  deleteCommentFromDb,
} = require("../models/comments.model");

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

exports.deleteComment = ({ params }, res, next) => {
  deleteCommentFromDb(params)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
