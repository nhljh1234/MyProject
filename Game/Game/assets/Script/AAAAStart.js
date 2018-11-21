window._g_require = function (fileName, moduleName) {
    let object = require(fileName);
    moduleName = moduleName || fileName;
    require('VsCodeTool').getModuleVsCodeStr(object, moduleName);
    return object;
};

