local designDataModule = require("Module.DesignDataModule");
local logModule = require("Module.LogModule");

local tab = designDataModule.getDataById("building", "buildingFunction", 2);

local tab_1 = designDataModule.getDataByKey("action", "action", "type", "rest");

local tab_2 = designDataModule.getDataByKey("action", "action", "type", "rest", false);