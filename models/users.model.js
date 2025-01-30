const { sqlReturnTable, sqlReturnItem, checkValueExists } = require("./utils");

exports.selectUsers = () => {
  const sql = "SELECT * FROM users;";
  return sqlReturnTable(sql);
};

exports.selectUser = ({ username }) => {
  return checkValueExists({ username }).then(() => {
    const sql = "SELECT * FROM users WHERE username = $1;";
    return sqlReturnItem(sql, [username]);
  });
};
