Page({
  data: {
    userName: "张三",
    userId: "123456"
  },

  viewPersonalInfo() {
    wx.showToast({
      title: "查看个人信息",
      icon: "none"
    });
    // You could add navigation to a detailed profile info page here
  },

  viewSettings() {
    wx.showToast({
      title: "进入设置",
      icon: "none"
    });
    // You could add navigation to a settings page here
  },

  navigateToHistory() {
    wx.navigateTo({
      url: "/pages/historyRecords/historyRecords"
    });
  },

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
          // Implement logout logic here if needed
          // 例如，清除本地存储的用户信息
          wx.removeStorageSync('userInfo');
          // 导航回首页或其他页面
          wx.reLaunch({
            url: '/pages/home/home'
          });
        }
      }
    });
  },

  // 添加导航到登录页面的方法
  navigateToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
});