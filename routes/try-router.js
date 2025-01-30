const tryRouter = require("express").Router();

tryRouter.get("/", (req, res) => {
  res.status(200).send("<h1>All OK from /api/tryrouter</h1>");
});

module.exports = tryRouter;
