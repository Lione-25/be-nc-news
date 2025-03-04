const {
  selectComments,
  insertComment,
  deleteCommentFromDb,
  updateComment,
} = require("../models/comments.model");

exports.getComments = ({ params, query }, res, next) => {
  selectComments(params, query)
    .then((comments) => {
      res.status(200).send(comments);
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

exports.patchComment = ({ params, body }, res, next) => {
  updateComment(params, body)
    .then((comment) => {
      res.status(200).send({ comment });
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
