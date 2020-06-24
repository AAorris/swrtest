export const fetchAndStoreField = (attr) => async (url) => {
  const resp = await fetch(url);
  const result = await resp.json();
  localStorage.setItem(attr, result[attr]);
  return result;
};

export const getStoredField = (key, fallback) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return fallback;
  }
};