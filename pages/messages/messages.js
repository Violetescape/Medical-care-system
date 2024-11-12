Page({
  data: {
    messages: []
  },

  onLoad() {
    this.fetchMessages();
  },

  // 获取消息列表数据的函数
  fetchMessages() {
    // 显示加载中动画
    wx.showLoading({
      title: '加载中...'
    });

    const db = wx.cloud.database();
    db.collection('Messages').orderBy('timestamp', 'desc').get()
      .then(res => {
        const messages = res.data.map(item => ({
          ...item,
          formattedTime: this.formatTime(item.timestamp)
        }));
        this.setData({ messages });
      })
      .catch(err => {
        wx.showToast({
          title: "无法获取消息列表",
          icon: "none"
        });
        console.error('数据库查询失败', err);
      })
      .finally(() => {
        // 隐藏加载中动画
        wx.hideLoading();
      });
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  },

  // 下拉刷新时触发
  onPullDownRefresh() {
    this.fetchMessages(); // 重新获取消息列表
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
  },

  viewMessage(event) {
    const messageId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/messageDetail/messageDetail?id=${messageId}`
    });
  }
});
