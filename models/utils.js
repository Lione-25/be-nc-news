const db = require("../db/connection");

exports.checkValueExists = ({ username, article_id, comment_id, topic }) => {
  let table = "";
  let column = "";
  let itemName = "";
  let args = [];
  if (username) {
    table = "users";
    column = "username";
    itemName = "Username";
    args = [username];
  } else if (article_id) {
    table = "articles";
    column = "article_id";
    itemName = "Article";
    args = [article_id];
  } else if (comment_id) {
    table = "comments";
    column = "comment_id";
    itemName = "Comment";
    args = [comment_id];
  } else if (topic) {
    table = "topics";
    column = "slug";
    itemName = "Topic";
    args = [topic];
  } else {
    return Promise.reject(
      "internal error: please input {item: value} to check if value exists"
    );
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
