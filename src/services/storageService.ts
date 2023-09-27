class StorageService {
  getStorage = (key: string, local = false) => {
    if (!key) {
      return null;
    }
    return !local ? sessionStorage.getItem(key) : localStorage.getItem(key);
  };

  setStorage = (key: string, value: string, local = false) => {
    if (!key) {
      return null;
    }
    !local ? sessionStorage.setItem(key, value) : localStorage.setItem(key, value);
  };

  removeStorage = (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  };
}

// export default new StorageService();
export default new StorageService() as StorageService;
