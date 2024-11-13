Page({
  data: {
    // 页面数据
  },

  // 用户点击登录按钮时的处理函数
  login: function () {
    wx.login({
      success: res => {
        if (res.code) {
          // 调用云函数，传递 code 获取 openid 和 session_key
          wx.cloud.callFunction({
            name: 'login',  // 云函数名称
            data: {
              code: res.code  // 将 code 传递给云函数
            },
            success: function(response) {
              console.log("成功返回：", response.result);

              // 获取 openid 和 session_key
              const { openid, session_key } = response.result;

              // 保存用户信息到云数据库
              const db = wx.cloud.database();
              const userCollection = db.collection('users');  // 选择集合

              // 保存用户数据到数据库
              userCollection.add({
                data: {
                  openid: openid,
                  session_key: session_key,
                  userName: '默认昵称',  // 你可以根据需要设置默认的昵称
                  avatarUrl: '默认头像链接',  // 默认头像链接
                  loginTime: new Date()  // 登录时间
                },
                success: res => {
                  console.log('用户信息保存成功', res);
                  // 保存用户信息到本地存储
                  wx.setStorageSync('userInfo', {
                    openid: openid,
                    userName: '默认昵称',
                    avatarUrl: '默认头像链接'
                  });

                  // 登录成功后跳转到首页或其他页面
                  wx.reLaunch({
                    url: '/pages/home/home'  // 这里修改为你的主页面路径
                  });
                },
                fail: err => {
                  console.error('保存用户信息失败', err);
                }
              });
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
