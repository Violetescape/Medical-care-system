Page({
  data: {
    bannerImages: [
      { src: "../../images/banner1.jpg" },
      { src: "../../images/banner2.jpg" },
    ]
  },
  goToRecord() {
    wx.navigateTo({
      url: '/pages/record/record'
    });
  },
  goToReimbursement() {
    wx.navigateTo({
      url: '/pages/reimbursement/reimbursement'
    });
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
})
