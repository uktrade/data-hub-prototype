function trimArray(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => item.length > 0);
  } else if (value && value.length > 0) {
    return [value];
  }
  return null;
}

module.exports = {
  trimArray
};
