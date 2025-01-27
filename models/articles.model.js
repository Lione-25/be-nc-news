const db = require("../db/connection");
const { checkItemExists } = require("./utils");

exports.selectArticle = ({ article_id }) => {
  const sql = "SELECT * FROM articles WHERE article_id = $1;";
  return db.query(sql, [article_id]).then(({ rows }) => {
    return checkItemExists(rows);
  });
};
