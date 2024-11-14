// app.js
App({
  globalData: {
    userInfo: null,  // 存储全局的用户信息
  },
  onLaunch: function () {
    // 小程序启动之后触发
    wx.cloud.init({
      env: 'database-8g6jfvgnb5bd2040', // 替换为您的云环境ID
      traceUser: true,
    });
    // 检查本地存储中的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 如果用户信息存在，将其保存到全局数据中
      this.globalData.userInfo = userInfo;
    } else {
      // 如果用户信息不存在，跳转到登录页面
      wx.navigateTo({
        url: '/pages/login/login',  // 修改为你的登录页面路径
      });
    }
  },
  // 可以提供其他全局方法来处理用户信息的更新
  updateUserInfo: function(newUserInfo) {
    this.globalData.userInfo = newUserInfo;
    wx.setStorageSync('userInfo', newUserInfo);  // 更新本地存储
  },
});