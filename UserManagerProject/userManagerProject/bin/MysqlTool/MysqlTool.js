/**
 * Created by Administrator on 2017/10/30
 * mysql处理模块
 */

"use strict";

var outModule = {};
var local = {};
var mysql = require('mysql');

/**
 * 缓存connection链接
 * @type dbName - connection
 */
local.mysqlObjSave = {};

//host名
//const HOST = "localhost";
const HOST = "localhost";
//用户名
const USER_NAME = "root";
//密码
//const PASSWORD = "root";
const PASSWORD = "xiaoliao";

/**
 * 根据一个table表的名字新建一个链接对象
 * @param dbName
 */
local.buildMysqlObj = (dbName) => {
    if (local.mysqlObjSave[dbName]) {
        return local.mysqlObjSave[dbName];
    }
    let connection = mysql.createConnection({
        host: HOST,
        user: USER_NAME,
        password: PASSWORD,
        insecureAuth: true,
        database: dbName,
        port: 3306
    });
    local.mysqlObjSave[dbName] = connection;
    connection.connect();
    connection.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('err reconnect, err is PROTOCOL_CONNECTION_LOST');
            local.mysqlObjSave[dbName] = undefined;
            local.buildMysqlObj(dbName);
        } else {
            console.log(err.stack || err);
        }
    });
    return connection;
};

function query(cmdStr, callback) {
    this.connection.query(cmdStr, (err, rows, field) => {
        if (callback) {
            callback(err, rows, field);
        }
    });
}

function end() {
    this.connection.end();
    local.mysqlObjSave[this.dbName] = undefined;
}

/**
 * 根据服务器的名字获取一个对指定数据表的操作集合
 * @param dbName
 */
outModule.getMysqlObjByDBName = (dbName) => {
    let obj = {};
    obj.dbName = dbName;
    obj.connection = local.buildMysqlObj(dbName);
    obj.query = query;
    obj.end = end;
    return obj;
};

module.exports = outModule;