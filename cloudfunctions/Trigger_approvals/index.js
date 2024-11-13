'use strict';
const cloud = require('wx-server-sdk');
cloud.init({ env: 'database-8g6jfvgnb5bd2040' }); // 初始化云环境

exports.main = async (event, context) => {
  try {
    const result = await cloud.callFunction({
      name: 'cloudbase_module',
      data: {}
    });
    return result; // 返回调用结果
  } catch (e) {
    return {
      error: e.message
    };
  }
};