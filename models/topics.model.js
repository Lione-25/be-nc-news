const { sqlReturnTable, sqlReturnItem } = require("./utils");

exports.selectTopics = () => {
  const sql = "SELECT * FROM topics;";
  return sqlReturnTable(sql);
};

exports.insertTopic = ({ slug, description }) => {
  const sql = `INSERT INTO topics (slug, description) 
        VALUES ($1, $2) 
        RETURNING *;`;
  const args = [slug, description];
  return sqlReturnItem(sql, args).catch((err) => {
    let reason = err;
    if (err.code === "23505") {
      reason = { status: 400, msg: "Topic already exists" };
    }
    return Promise.reject(reason);
  });
};
