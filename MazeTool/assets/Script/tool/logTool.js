var outModule = {};
var local = {};
outModule.saveLog = (string) => {
    local.cb(string);
};

outModule.init = (cb) => {
    local.cb = cb;
};

module.exports = outModule;