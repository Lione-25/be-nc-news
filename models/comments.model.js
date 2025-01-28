const db = require("../db/connection");
const { checkValueExists } = require("./utils");

exports.selectComments = ({ article_id }) => {
  return checkValueExists({ article_id })
    .then(() => {
      const sql = `SELECT * FROM 
        comments 
        WHERE article_id = $1
        ORDER BY created_at DESC;`;

      return db.query(sql, [article_id]);
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = ({ username, body }, { article_id }) => {
  return checkValueExists({ article_id })
    .then(() => {
      const sql = `INSERT INTO comments (author, body, article_id) 
        VALUES ($1, $2, $3) 
        RETURNING *;`;
      const args = [username, body, article_id];

      return db.query(sql, args);
    })
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      let reason = err;
      if (err.code === "23503") {
        reason = { status: 401, msg: "Unable to identify user" };
      }
      return Promise.reject(reason);
    });
};

exports.deleteCommentFromDb = ({ comment_id }) => {
  return checkValueExists({ comment_id }).then(() => {
    const sql = `DELETE FROM 
        comments 
        WHERE comment_id = $1;`;
    return db.query(sql, [comment_id]);
  });
};
