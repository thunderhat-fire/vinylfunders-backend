function removeEmptyFields(obj) {
  for (const key in obj) {
    if (obj[key] === "" || obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  }

  return obj;
}

module.exports = removeEmptyFields;
