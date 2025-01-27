const db = require("../db/connection");
const { checkItemExists } = require("./utils");

exports.selectComments = ({ article_id }) => {
  const sql = `SELECT * FROM 
  comments 
  WHERE article_id = $1
  ORDER BY created_at DESC;`;
  return db.query(sql, [article_id]).then(({ rows }) => {
    return checkItemExists(rows) || rows;
  });
};

exports.insertComment = ({ username, body }, { article_id }) => {
  if (username === undefined || body === undefined) {
    return Promise.reject({ code: 400 });
  }
  const sql1 = "SELECT * FROM users WHERE username = $1";
  const sql2 = "SELECT * FROM articles WHERE article_id = $1";
  return Promise.all([db.query(sql1, [username]), db.query(sql2, [article_id])])
    .then((result) => {
      const usernameData = result[0].rows;
      const articleData = result[1].rows;
      const sql = `INSERT INTO comments (author, body, article_id) 
        VALUES ($1, $2, $3) 
        RETURNING *;`;
      const args = [username, body, article_id];

      return (
        checkItemExists(usernameData) ||
        checkItemExists(articleData) ||
        db.query(sql, args)
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
