export const formTrim = obj => {
  Object.keys(obj).map(key => {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    }
  });
  return obj;
};
