export const formTrim = (initial = {}) => {
  const handle = data => {
    if (!data) return data;
    if (typeof data === 'string') {
      data = data.trim();
    } else if (Array.isArray(data)) {
      data.forEach((v, index) => {
        data[index] = handle(v);
      });
    } else if (typeof data === 'object') {
      return formTrim(data);
    }
    return data;
  };
  const itera = obj => {
    Object.keys(obj).forEach(key => {
      obj[key] = handle(obj[key]);
    });
    return obj;
  };

  return itera(initial);
};
