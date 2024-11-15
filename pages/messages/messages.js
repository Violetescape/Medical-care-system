Page({
    data: {
      messages: [],
      batchDeleteMode: false // Track if batch delete mode is enabled
    },
  
    onLoad() {
      this.fetchMessages();
    },
  
    fetchMessages() {
      wx.showLoading({ title: '加载中...' });
      const db = wx.cloud.database();
      db.collection('Messages').orderBy('timestamp', 'desc').get()
        .then(res => {
          const messages = res.data.map(item => ({
            ...item,
            formattedTime: this.formatTime(item.timestamp),
            translateX: 0, // For swipe-to-delete
            isSelected: false // For batch selection
          }));
          this.setData({ messages });
        })
        .catch(err => {
          wx.showToast({ title: "无法获取消息列表", icon: "none" });
          console.error('数据库查询失败', err);
        })
        .finally(() => {
          wx.hideLoading();
        });
    },
  
    onPullDownRefresh() {
      this.fetchMessages();
      wx.stopPullDownRefresh();
    },
  
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
  
    onTouchStart(event) {
      this.startX = event.touches[0].clientX;
      this.swipedMessageId = event.currentTarget.dataset.id;
    },
  
    onTouchMove(event) {
      const moveX = event.touches[0].clientX;
      const diffX = this.startX - moveX;
  
      const updatedMessages = this.data.messages.map(item => {
        if (item._id === this.swipedMessageId) {
          item.translateX = diffX > 50 ? -80 : 0;
        }
        return item;
      });
  
      this.setData({ messages: updatedMessages });
    },
  
    onTouchEnd() {
      this.startX = 0;
    },
  
    enterBatchDeleteMode() {
      this.setData({ batchDeleteMode: true });
    },
  
    onLongPress(event) {
      const messageId = event.currentTarget.dataset.id;
      const message = this.data.messages.find(item => item._id === messageId);
      
      if (message && message.text) {
        const queryIdMatch = message.text.match(/查询 ID 为：([\w]+)/);
        if (queryIdMatch && queryIdMatch[1]) {
          const queryId = queryIdMatch[1];
          wx.setClipboardData({
            data: queryId,
            success: () => {
              wx.showToast({ title: '查询ID已复制', icon: 'success' });
            },
            fail: () => {
              wx.showToast({ title: '复制失败', icon: 'none' });
            }
          });
        } else {
          wx.showToast({ title: '未找到查询ID', icon: 'none' });
        }
      }
    },
  
    deleteMessage(event) {
      const messageId = event.currentTarget.dataset.id;
      const db = wx.cloud.database();
  
      db.collection('Messages').doc(messageId).remove()
        .then(() => {
          wx.showToast({ title: '删除成功', icon: 'success' });
          this.fetchMessages();
        })
        .catch(err => {
          wx.showToast({ title: '删除失败', icon: 'none' });
          console.error('删除消息失败', err);
        });
    },
  
    deleteSelectedMessages() {
      const db = wx.cloud.database();
      const selectedIds = this.data.messages
        .filter(item => item.isSelected)
        .map(item => item._id);
  
      const deletePromises = selectedIds.map(id =>
        db.collection('Messages').doc(id).remove()
      );
  
      Promise.all(deletePromises)
        .then(() => {
          wx.showToast({ title: '批量删除成功', icon: 'success' });
          this.setData({ batchDeleteMode: false });
          this.fetchMessages();
        })
        .catch(err => {
          wx.showToast({ title: '删除失败', icon: 'none' });
          console.error('批量删除消息失败', err);
        });
    },
  
    cancelBatchDelete() {
      const resetMessages = this.data.messages.map(item => ({
        ...item,
        isSelected: false
      }));
      this.setData({
        messages: resetMessages,
        batchDeleteMode: false
      });
    },
  
    toggleSelection(event) {
      const id = event.currentTarget.dataset.id;
      const updatedMessages = this.data.messages.map(item => {
        if (item._id === id) {
          return { ...item, isSelected: !item.isSelected };
        }
        return item;
      });
      this.setData({ messages: updatedMessages });
    }
  });