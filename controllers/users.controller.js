const { selectUsers, selectUser } = require("../models/users.model");

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUser = ({ params }, res, next) => {
  selectUser(params)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
