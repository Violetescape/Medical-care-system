Page({
  data: {
    userName: '',  // 用户名
    avatarUrl: '', // 头像
    userInfo: null  // 存储用户信息
  },

  onLoad: function () {
    // 页面加载时，检查本地存储是否有用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userName: userInfo.userName,
        avatarUrl: userInfo.avatarUrl,
        userInfo: userInfo
      });
    }
  },

  // 用户点击查看个人信息时的处理函数
  viewPersonalInfo() {
    wx.showToast({
      title: "查看个人信息",
      icon: "none"
    });
    // 可以在这里添加跳转到个人信息详细页面的逻辑
  },

  // 用户点击进入设置时的处理函数
  viewSettings() {
    wx.showToast({
      title: "进入设置",
      icon: "none"
    });
    // 可以在这里添加跳转到设置页面的逻辑
  },

  // 用户点击退出登录时的处理函数
  logout() {
    wx.showModal({
      title: "确认退出",
      content: "您确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: "已退出",
            icon: "success"
          });

          // 清除本地存储中的用户信息
          wx.removeStorageSync('userInfo');

          // 清空页面上的用户信息
          this.setData({
            userName: '',
            avatarUrl: '',
            userInfo: null
          });

          // 导航回首页或登录页面
          wx.reLaunch({
            url: '/pages/home/home'  // 修改为你希望跳转的页面
          });
        }
      }
    });
  },

  // 用户点击登录按钮时的处理函数
  navigateToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'  // 修改为你的登录页面路径
    });
  }
});
