Page({
  data: {
    isLogging: false, // 用于控制登录状态，显示或隐藏加载动画
    hasUserInfo: false, // 用于判断用户是否已登录并获取到用户信息
    userInfo: {}, // 存储用户信息
  },

  // 用户点击登录按钮时的处理函数
  login: function () {
    // 检查是否授权过
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 如果已经授权，直接获取用户信息
          this.getUserInfo();
        } else {
          // 如果没有授权，弹出授权提示框
          wx.showModal({
            title: '授权登录',
            content: '我们需要获取您的微信昵称和头像，以便为您提供更好的服务。',
            success: (modalRes) => {
              if (modalRes.confirm) {
                // 用户点击允许授权
                this.getUserInfo();
              } else {
                // 用户点击拒绝授权
                wx.showToast({
                  title: '授权失败，无法登录',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          });
        }
      }
    });
  },

  // 获取用户信息的函数
  getUserInfo: function () {
    this.setData({ isLogging: true }); // 显示登录中的加载动画

    wx.getUserProfile({
      desc: '用于完善会员资料', // 显示授权提示
      success: (profileRes) => {
        const userInfo = profileRes.userInfo;

        // 假设这里的用户信息存储到本地
        wx.setStorageSync('userInfo', userInfo);

        // 更新用户信息和登录状态
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true,
          isLogging: false // 登录完成，隐藏加载动画
        });

        // 登录成功后跳转到 bindInfo 页面
        wx.reLaunch({
          url: '/pages/bindInfo/bindInfo'  // 跳转到绑定信息页面
        });
      },
      fail: (error) => {
        console.error("获取用户信息失败", error);
        this.setData({ isLogging: false }); // 登录失败，隐藏加载动画
      }
    });
  }
});
