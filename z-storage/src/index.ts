export type StorageValue = {
    value: any;
    expires: number;
    setTime: number;
}

export type StorageType = 'localStorage' | 'sessionStorage';

function getStorageKey(local: boolean): StorageType {
    return local ? 'localStorage' : 'sessionStorage';
}

export function setStorage(key: string, value: StorageValue, expires: number, local: boolean = true) {
    const storageKey = getStorageKey(local);
    const data: StorageValue = {
        value,
        expires,
        setTime: +new Date(),
    };
    window[storageKey].setItem(
        key,
        JSON.stringify(data),
    );
}

export function getStorage(key: string, local: boolean = true) {
    const storageKey = getStorageKey(local);
    const _data = window[storageKey].getItem(key);
    let data: StorageValue | undefined;
    if (_data) {
        data = JSON.parse(_data);
        if (data && data.setTime + data.expires * 1000 < +new Date()) {
            window[storageKey].removeItem(key);
            return undefined;
        }
    }
    return ((data || {}) as StorageValue).value;
}

export function removeStorage(key: string, local: boolean = true) {
    const storageKey = getStorageKey(local);
    window[storageKey].removeItem(key);
}

export function clearStorage(local: boolean = true) {
    const storageKey = getStorageKey(local);
    window[storageKey].clear();
}

const storage = {
    setStorage,
    getStorage,
    removeStorage,
    clearStorage,
};

export default storage;