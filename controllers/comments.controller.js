const { selectComments } = require("../models/comments.model");

exports.getComments = ({ params }, res, next) => {
  selectComments(params)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
