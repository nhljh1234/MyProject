window._g_require = function (fileName, moduleName, addInAll = true) {
    let object = require(fileName);
    moduleName = moduleName || fileName;
    require('VsCodeTool').getModuleVsCodeStr(object, moduleName, addInAll);
    return object;
};

