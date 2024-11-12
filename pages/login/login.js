Page({
  data: {
    // 其他页面数据
  },

  // 用户点击登录按钮时的处理函数
  login: function () {
    // 调用 wx.login 获取 code
    wx.login({
      success: res => {
        if (res.code) {
          // 调用云函数，将 code 传递给云函数
          wx.cloud.callFunction({
            name: 'login',  // 确保这里的 'login' 是你创建的云函数名称
            data: {
              code: res.code  // 将 code 传递给云函数
            },
            success: function(response) {
              console.log("成功返回：", response.result);
              // 你可以将 session_key 和 openid 保存在本地存储或状态中
              wx.setStorageSync('session_key', response.result.session_key);
              wx.setStorageSync('openid', response.result.openid);
            },
            fail: function(error) {
              console.error("调用云函数失败", error);
            }
          });
        } else {
          console.error('登录失败！' + res.errMsg);
        }
      }
    });
  }
});
