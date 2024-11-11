Page({
  data: {
    messages: []
  },

  onLoad() {
    this.fetchMessages();
  },

  fetchMessages() {
    wx.request({
      url: 'https://your-backend.com/api/messages', // API 地址
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ messages: res.data });
        } else {
          wx.showToast({
            title: "无法获取消息列表",
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
  },

  viewMessage(event) {
    const messageId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/messageDetail/messageDetail?id=${messageId}`
    });
  }
});
