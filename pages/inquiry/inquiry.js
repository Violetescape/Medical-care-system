Page({
  data: {
    queryResults: []
  },

  onLoad() {
    this.fetchReimbursements();
  },

  fetchReimbursements() {
    wx.request({
      url: `https://your-backend.com/api/reimbursements?userId=123456`, // 使用用户 ID 获取数据
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ queryResults: res.data });
        } else {
          wx.showToast({
            title: "无法获取报销记录",
            icon: "none"
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: "请求失败",
          icon: "none"
        });
      }
    });
  }
});
