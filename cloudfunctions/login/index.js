const cloud = require('wx-server-sdk');
cloud.init({
  env: 'database-8g6jfvgnb5bd2040'  // 替换为你的环境ID
});

const axios = require('axios');  // 引入 axios 库用于发送 HTTP 请求
const db = cloud.database(); // 获取数据库实例

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
      const openid = response.data.openid;

      // 查询数据库中的用户信息，使用 openid 查找是否已经存在
      const userRecord = await db.collection('users').where({ openid }).get();

      let employeeId = null;
      // 如果数据库中已经存在该用户，则获取其 employeeId
      if (userRecord.data.length > 0) {
        employeeId = userRecord.data[0].employeeId; // 假设数据库中有 employeeId 字段
      }

      // 如果该用户不存在，可以选择插入新记录到数据库中，或者返回 null
      if (userRecord.data.length === 0) {
        console.log('用户不存在，创建新的记录');
        // 可以选择在此处插入用户记录，比如：
        // await db.collection('users').add({
        //   data: {
        //     openid: openid,
        //     employeeId: null,  // 初始时没有员工信息
        //     avatarUrl: '/images/default-avatar.png',  // 默认头像路径
        //     createTime: new Date()
        //   }
        // });
      }

      // 返回 openid, session_key 和 employeeId
      return {
        openid,
        session_key: response.data.session_key,
        employeeId  // 返回 employeeId，若无则为 null
      };
    } else {
      throw new Error('获取openid失败');
    }
  } catch (err) {
    console.error('调用微信登录失败', err);
    throw new Error('调用微信登录失败，错误信息：' + err.message);  // 捕获错误并返回更详细的错误信息
  }
};
