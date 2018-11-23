var local = {};

export function setData(key, value) {
    local[key] = value;
};

export function getData(key) {
    return local[key];
};

export function removeData(key) {
    local[key] = undefined;
};