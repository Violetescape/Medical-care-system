// 格式化时间戳为可读的日期格式
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

Page({
  data: {
    messages: []
  },

  onLoad() {
    this.fetchMessages();
  },

  fetchMessages() {
    const db = wx.cloud.database();
    db.collection('Messages').where({
      _openid: 'oXLfs65lwsgZ9gJTLLZiO8usZ73o'  // 替换为测试用户的 OpenID
    })
    .orderBy('timestamp', 'desc')
    .get()
      .then(res => {
        const messages = res.data.map(item => ({
          ...item,
          formattedTime: formatTime(item.timestamp)
        }));
        this.setData({ messages });
      })
      .catch(err => {
        wx.showToast({
          title: "无法获取消息列表",
          icon: "none"
        });
        console.error('数据库查询失败', err);
      });
  }
});
