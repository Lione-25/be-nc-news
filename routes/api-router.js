const apiRouter = require("express").Router();

const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

const { getEndpoints } = require("../controllers/endpoints.controller");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
