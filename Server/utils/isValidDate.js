const isValidDate = (value) => {
  const d = new Date(value);
  return d instanceof Date && !isNaN(d);
};

module.exports = isValidDate;