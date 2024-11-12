Page({
  data: {
    messages: []
  },

  onLoad() {
    this.fetchMessages();
  },

  fetchMessages() {
    const db = wx.cloud.database();
    db.collection('Messages').get().then(res => {
      this.setData({
        messages: res.data
      });
    }).catch(err => {
      wx.showToast({
        title: "无法获取消息列表",
        icon: "none"
      });
      console.error('数据库查询失败', err);
    });
  }
});
