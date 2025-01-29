const db = require("../db/connection");

exports.checkValueExists = (value) => {
  let table = "";
  let column = "";
  let itemName = "";
  let args = [];
  if (value.username) {
    table = "users";
    column = "username";
    itemName = "Username";
    args = [value.username];
  }
  if (value.article_id) {
    table = "articles";
    column = "article_id";
    itemName = "Article";
    args = [value.article_id];
  }
  if (value.comment_id) {
    table = "comments";
    column = "comment_id";
    itemName = "Comment";
    args = [value.comment_id];
  }
  if (value.topic) {
    table = "topics";
    column = "slug";
    itemName = "Topic";
    args = [value.topic];
  }
  const sql = `SELECT * FROM ${table} WHERE ${column} = $1`;
  return db.query(sql, args).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: `${itemName} not found`, status: 404 });
    }
  });
};

exports.sqlReturnTable = (sql, args) => {
  return db.query(sql, args).then(({ rows }) => {
    return rows;
  });
};

exports.sqlReturnItem = (sql, args) => {
  return db.query(sql, args).then(({ rows }) => {
    return rows[0];
  });
};

exports.getCommentCount = (article_id) => {
  if (article_id === undefined) {
    return Promise.reject(
      "internal error: please input article id to get comment count"
    );
  }
  const sql = `SELECT COUNT(comment_id) FROM comments WHERE article_id=$1 GROUP BY article_id;`;
  return db.query(sql, [article_id]).then(({ rows }) => {
    return rows[0] ? Number(rows[0].count) : 0;
  });
};
