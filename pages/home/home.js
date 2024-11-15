Page({
  data: {
    // Banner images data
    bannerImages: [
      { src: "../../images/banner1.jpg" },
      { src: "../../images/banner2.jpg" },
      { src: "../../images/banner3.jpg" }
    ],
    // Tab bar data
    selected: 0, // Default selected tab
    list: [
      {
        pagePath: "pages/messages/messages",
        text: "消息",
        iconPath: "images/messages.png",
        selectedIconPath: "images/messages_active.png"
      },
      {
        pagePath: "pages/home/home",
        text: "主页",
        iconPath: "images/home.png",
        selectedIconPath: "images/home_active.png"
      },
      {
        pagePath: "pages/profile/profile",
        text: "我的",
        iconPath: "images/profile.png",
        selectedIconPath: "images/profile_active.png"
      }
    ]
  },

  // Navigate to record page
  goToRecord() {
    wx.navigateTo({
      url: '/pages/record/record'
    });
  },

  // Navigate to reimbursement page or login page if not logged in
  goToReimbursement() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.navigateTo({
        url: '/pages/reimbursement/reimbursement'
      });
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },

  // Navigate to inquiry page
  goToInquiry() {
    wx.navigateTo({
      url: '/pages/inquiry/inquiry'
    });
  },

  // Switch tab to messages
  goToMessages() {
    this.setData({ selected: 0 });
    wx.switchTab({
      url: '/pages/messages/messages'
    });
  },

  // Switch tab to home
  goToHome() {
    this.setData({ selected: 1 });
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // Switch tab to profile
  goToProfile() {
    this.setData({ selected: 2 });
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  }
});
