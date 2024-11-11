Page({
  data: {
    amount: "",
    date: "",
    note: ""
  },

  onAmountChange(event) {
    this.setData({ amount: event.detail.value });
  },

  onDateChange(event) {
    this.setData({ date: event.detail.value });
  },

  onNoteChange(event) {
    this.setData({ note: event.detail.value });
  },

  submitApplication() {
    if (!this.data.amount || !this.data.date) {
      wx.showToast({
        title: "请输入金额和日期",
        icon: "none"
      });
      return;
    }

    // 提交申请
    wx.request({
      url: 'https://your-backend.com/api/reimbursements',
      method: 'POST',
      data: {
        amount: this.data.amount,
        date: this.data.date,
        note: this.data.note
      },
      success: (res) => {
        if (res.statusCode === 201) {
          wx.showToast({
            title: "申请已提交",
            icon: "success"
          });
          this.setData({ amount: "", date: "", note: "" });
        } else {
          wx.showToast({
            title: "提交失败",
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
