function getStorageKey(local) {
  return local ? "localStorage" : "sessionStorage";
}
function setStorage(key, value, expires, local = true) {
  const storageKey = getStorageKey(local);
  const data = {
    value,
    expires,
    setTime: +/* @__PURE__ */ new Date()
  };
  window[storageKey].setItem(
    key,
    JSON.stringify(data)
  );
}
function getStorage(key, local = true) {
  const storageKey = getStorageKey(local);
  const _data = window[storageKey].getItem(key);
  let data;
  if (_data) {
    data = JSON.parse(_data);
    if (data && data.setTime + data.expires * 1e3 < +/* @__PURE__ */ new Date()) {
      window[storageKey].removeItem(key);
      return void 0;
    }
  }
  return (data || {}).value;
}
function removeStorage(key, local = true) {
  const storageKey = getStorageKey(local);
  window[storageKey].removeItem(key);
}
function clearStorage(local = true) {
  const storageKey = getStorageKey(local);
  window[storageKey].clear();
}
const storage = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage
};
export {
  clearStorage,
  storage as default,
  getStorage,
  removeStorage,
  setStorage
};
