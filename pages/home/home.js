Page({
  data: {
    // Banner images data
    bannerImages: [
      { src: "../../images/banner1.jpg" },
      { src: "../../images/banner2.jpg" },
      { src: "../../images/banner3.jpg" }
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
    const targetUrl = userInfo 
      ? '/pages/reimbursement/reimbursement' 
      : '/pages/login/login';

    wx.navigateTo({ url: targetUrl });
  },

  // Navigate to inquiry page
  goToInquiry() {
    wx.navigateTo({
      url: '/pages/inquiry/inquiry'
    });
  }
});
