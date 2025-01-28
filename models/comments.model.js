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
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" }); //or {code: ''}==> will think its an sql error
  }

  return Promise.all([
    checkValueExists({ username }),
    checkValueExists({ article_id }),
  ])
    .then(() => {
      const sql = `INSERT INTO comments (author, body, article_id) 
        VALUES ($1, $2, $3) 
        RETURNING *;`;
      const args = [username, body, article_id];

      return db.query(sql, args);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
