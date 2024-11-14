// 云函数 login/index.js
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'database-8g6jfvgnb5bd2040'  // 替换为你的环境ID
});

const axios = require('axios');  // 引入 axios 库用于发送 HTTP 请求

exports.main = async (event, context) => {
  const { code } = event;  // 获取前端传来的 code
  try {
    // 使用 axios 发送 HTTP 请求到微信的 jscode2session 接口
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: 'wxf39def42c56b3494',  // 替换为你的 AppID
        secret: '4cf73a0da66f996b4bdbd8232b14f92d',  // 替换为你的 AppSecret
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    // 处理请求返回的结果
    if (response.data && response.data.openid) {
      return {
        openid: response.data.openid,
        session_key: response.data.session_key
      };
    } else {
      throw new Error('获取openid失败');
    }
  } catch (err) {
    console.error('调用微信登录失败', err);
    throw err;
  }
};
