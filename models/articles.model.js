const {
  checkValueExists,
  sqlReturnItem,
  sqlReturnTable,
  getCommentCount,
  formatArticlesPage,
} = require("./utils");

exports.selectArticle = ({ article_id }) => {
  return checkValueExists({ article_id }).then(() => {
    const sql = `SELECT 
    articles.article_id, 
    articles.author, 
    title, 
    topic, 
    articles.body, 
    articles.created_at, 
    articles.votes, 
    article_img_url, 
    COUNT(comment_id)::INT AS comment_count 
    FROM 
    articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id;`;
    return sqlReturnItem(sql, [article_id]);
  });
};

exports.selectAllArticles = async ({
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 1,
}) => {
  const validSortQueries = {
    sort_by: [
      "article_id",
      "author",
      "title",
      "topic",
      "created_at",
      "votes",
      "article_img_url",
    ],
    order: ["asc", "desc"],
  };

  const numberRegex = /^\d+$/;

  if (
    !validSortQueries.sort_by.includes(sort_by) ||
    !validSortQueries.order.includes(order) ||
    !numberRegex.test(limit) ||
    !numberRegex.test(p)
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid query values",
    });
  }

  const sqlBase = `SELECT 
  article_id, 
  author, 
  title, 
  topic, 
  created_at, 
  votes, 
  article_img_url, 
  COUNT(*) OVER() ::INT AS total_count
  FROM 
  articles`;

  const offset = p * limit - limit;
  const sqlEnd = ` ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${offset}`;

  let sql = sqlBase + sqlEnd;
  const args = [];

  if (topic) {
    const sqlCondition = " WHERE topic = $1";
    sql = sqlBase + sqlCondition + sqlEnd;
    args.push(topic);
    await checkValueExists({ topic });
  }

  const articles = await sqlReturnTable(sql, args);
  return formatArticlesPage(articles);
};

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  return checkValueExists({ article_id })
    .then(() => {
      const sql = `SELECT votes FROM articles WHERE article_id = $1;`;
      return sqlReturnItem(sql, [article_id]);
    })
    .then(({ votes }) => {
      const updatedVotes = votes + inc_votes;
      const sql = `UPDATE articles 
      SET votes = $1
      WHERE article_id = $2
      RETURNING *;`;
      args = [updatedVotes, article_id];
      return sqlReturnItem(sql, args);
    });
};

exports.insertArticle = ({ author, title, body, topic, article_img_url }) => {
  return checkValueExists({ topic })
    .then(() => {
      const sql = `INSERT INTO articles (author, title, body, topic, article_img_url) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;`;
      const args = [author, title, body, topic, article_img_url];
      return sqlReturnItem(sql, args).then((article) => {
        return { ...article, comment_count: 0 };
      });
    })
    .catch((err) => {
      let reason = err;
      if (err.code === "23503") {
        reason = { status: 401, msg: "Unable to identify user" };
      }
      if (err.functionName === "checkValueExists") {
        reason = { status: 400, msg: "Bad request" };
      }
      return Promise.reject(reason);
    });
};
