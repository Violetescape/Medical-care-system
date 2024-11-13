Page({
  data: {
    userName: '',  // 用户名
    avatarUrl: '', // 头像
    userInfo: null,  // 存储用户信息
    isLoggedIn: false  // 用于判断是否登录
  },

  onLoad: function () {
    // 页面加载时，检查本地存储是否有用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userName: userInfo.userName,
        avatarUrl: userInfo.avatarUrl,
        userInfo: userInfo, // 将用户信息存储到 data 中
        isLoggedIn: true  // 标记为已登录
      });
    }
  },

  // 用户点击进入设置时的处理函数
  viewSettings() {
    wx.navigateTo({
      url: "/pages/settings/settings"
    });
  },

  // 用户点击报销历史时的处理函数
  navigateToHistory() {
    wx.navigateTo({
      url: "/pages/historyRecords/historyRecords"
    });
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
            userInfo: null,
            isLoggedIn: false  // 更新为未登录状态
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
  },

  // 用户点击绑定职工信息按钮时的处理函数
  bindEmployeeInfo() {
    wx.navigateTo({
      url: '/pages/bindInfo/bindInfo'  // 绑定职工信息页面路径
    });
  }
});