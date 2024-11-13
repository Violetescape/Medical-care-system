Page({
  data: {
    bannerImages: [
      { src: "../../images/banner1.jpg" },
      { src: "../../images/banner2.jpg" },
      { src: "../../images/banner3.jpg" },
    ]
  },

  goToRecord() {
    wx.navigateTo({
      url: '/pages/record/record'
    });
  },

  goToReimbursement() {
    // 获取本地存储中的用户信息
    const userInfo = wx.getStorageSync('userInfo');

    if (userInfo) {
      // 如果用户信息存在，说明已登录，正常跳转到 reimbursement 页面
      wx.navigateTo({
        url: '/pages/reimbursement/reimbursement'
      });
    } else {
      // 如果用户信息不存在，说明未登录，跳转到 login 页面
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },

  goToInquiry() {
    wx.navigateTo({
      url: '/pages/inquiry/inquiry'
    });
  },

  goToMessages() {
    wx.switchTab({
      url: '/pages/messages/messages'
    });
  },

  goToHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  }
});
