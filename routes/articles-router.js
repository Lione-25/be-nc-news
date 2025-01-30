const {
  getAllArticles,
  getArticle,
  patchArticle,
  postArticle,
} = require("../controllers/articles.controller");
const {
  getComments,
  postComment,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles).post(postArticle);

articlesRouter.route("/:article_id").get(getArticle).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
