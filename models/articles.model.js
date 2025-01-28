const db = require("../db/connection");
const { checkValueExists } = require("./utils");

exports.selectArticle = ({ article_id }) => {
  return checkValueExists({ article_id })
    .then(() => {
      const sql = "SELECT * FROM articles WHERE article_id = $1;";
      return db.query(sql, [article_id]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectAllArticles = ({ sort_by = "created_at", order = "desc" }) => {
  const validQueries = {
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
  if (
    validQueries.sort_by.includes(sort_by) === false ||
    validQueries.order.includes(order) === false
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid query values",
    });
  }
  const sql = `SELECT article_id, author, title, topic, created_at, votes, article_img_url FROM 
  articles
  ORDER BY ${sort_by} ${order};`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  return checkValueExists({ article_id })
    .then(() => {
      const sql = `SELECT votes FROM articles WHERE article_id = $1;`;
      return db.query(sql, [article_id]);
    })
    .then(({ rows }) => {
      const votes = rows[0].votes + inc_votes;
      const sql = `UPDATE articles 
      SET votes = $1
      WHERE article_id = $2
      RETURNING *;`;
      args = [votes, article_id];
      return db.query(sql, args);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
