const db = require("../db/connection");
const {
  checkValueExists,
  sqlReturnTable,
  sqlReturnItem,
  formatPageOfItems,
  testPageQueries,
} = require("./utils");

exports.selectComments = ({ article_id }, { limit = 10, p = 1 }) => {
  return checkValueExists({ article_id })
    .then(() => {
      return testPageQueries(limit, p);
    })
    .then(() => {
      const offset = p * limit - limit;
      const sql = `SELECT * , COUNT(*) OVER() ::INT AS total_count FROM 
        comments 
        WHERE article_id = $1
        ORDER BY created_at DESC
        LIMIT ${limit} 
        OFFSET ${offset};`;
      return sqlReturnTable(sql, [article_id]).then((comments) => {
        if (comments.length === 0 && p === 1) {
          return { comments, total_count: 0 };
        } else return formatPageOfItems(comments, "comments");
      });
    });
};

exports.insertComment = ({ username, body }, { article_id }) => {
  return checkValueExists({ article_id })
    .then(() => {
      const sql = `INSERT INTO comments (author, body, article_id) 
        VALUES ($1, $2, $3) 
        RETURNING *;`;
      const args = [username, body, article_id];

      return sqlReturnItem(sql, args);
    })
    .catch((err) => {
      let reason = err;
      if (err.code === "23503") {
        reason = { status: 401, msg: "Unable to identify user" };
      }
      return Promise.reject(reason);
    });
};

exports.updateComment = ({ comment_id }, { inc_votes }) => {
  return checkValueExists({ comment_id })
    .then(() => {
      const sql = `SELECT votes FROM comments WHERE comment_id = $1;`;
      return sqlReturnItem(sql, [comment_id]);
    })
    .then(({ votes }) => {
      const updatedVotes = votes + inc_votes;
      const sql = `UPDATE comments 
      SET votes = $1
      WHERE comment_id = $2
      RETURNING *;`;
      args = [updatedVotes, comment_id];
      return sqlReturnItem(sql, args);
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
