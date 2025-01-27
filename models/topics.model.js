const db = require("../db/connection");

exports.selectTopics = () => {
  const sql = "SELECT * FROM topics;";
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};
