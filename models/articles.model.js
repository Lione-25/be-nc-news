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

exports.selectAllArticles = () => {
  const sql = `SELECT article_id, author, title, topic, created_at, votes, article_img_url FROM 
  articles
  ORDER BY created_at DESC`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};
