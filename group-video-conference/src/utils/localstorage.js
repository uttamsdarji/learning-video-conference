export const addLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = key => {
  let elem = localStorage.getItem(key);
  if (elem) {
    return JSON.parse(localStorage.getItem(key));
  }

  return null;
};

export const deleteLocalStorage = key => {
  localStorage.removeItem(key);
};
