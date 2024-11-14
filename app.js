// app.js
App({
    globalData: {
      newRecordId: null // 用于存储新增记录的 _id
    }
  })
App({
  onLaunch: function () {
    // 小程序启动之后 触发
    wx.cloud.init({
      env: 'database-8g6jfvgnb5bd2040', // 替换为您的云环境ID
      traceUser: true,
    });
    // ...其他初始化代码
  }
});
