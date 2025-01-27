exports.checkItemExists = (rows) => {
  if (rows.length === 0) {
    return Promise.reject({ msg: "Not found", status: 404 });
  }
  return rows;
};
