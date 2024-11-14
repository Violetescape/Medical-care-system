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

   // Pull down to refresh
   onPullDownRefresh() {
    this.fetchMessages();
    wx.stopPullDownRefresh(); // Stop the pull-down refresh animation
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  },

  // Swipe-to-delete handlers
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
    this.startX = 0; // Reset starting position
  },

  // Long press to enable batch delete mode
  onLongPress(event) {
    const messageId = event.currentTarget.dataset.id;
    this.setData({ batchDeleteMode: true });
    this.toggleSelection(messageId); // Start with selected message
  },

  // Toggle selection in batch mode
  toggleSelection(event) {
    const messageId = event.currentTarget.dataset.id;
    const updatedMessages = this.data.messages.map(item => {
      if (item._id === messageId) {
        item.isSelected = !item.isSelected;
      }
      return item;
    });
    this.setData({ messages: updatedMessages });
  },

  // Delete a single message with swipe-to-delete
  deleteMessage(event) {
    const messageId = event.currentTarget.dataset.id;
    const db = wx.cloud.database();

    db.collection('Messages').doc(messageId).remove()
      .then(() => {
        wx.showToast({ title: '删除成功', icon: 'success' });
        this.fetchMessages(); // Refresh messages list
      })
      .catch(err => {
        wx.showToast({ title: '删除失败', icon: 'none' });
        console.error('删除消息失败', err);
      });
  },

  // Delete all selected messages in batch mode
  deleteSelectedMessages() {
    const db = wx.cloud.database();
    const selectedIds = this.data.messages
      .filter(item => item.isSelected)
      .map(item => item._id);

    // Batch delete using selected IDs
    const deletePromises = selectedIds.map(id =>
      db.collection('Messages').doc(id).remove()
    );

    Promise.all(deletePromises)
      .then(() => {
        wx.showToast({ title: '批量删除成功', icon: 'success' });
        this.setData({ batchDeleteMode: false }); // Exit batch mode
        this.fetchMessages(); // Refresh messages list
      })
      .catch(err => {
        wx.showToast({ title: '删除失败', icon: 'none' });
        console.error('批量删除消息失败', err);
      });
  },

  // Cancel batch delete mode
  cancelBatchDelete() {
    const resetMessages = this.data.messages.map(item => ({
      ...item,
      isSelected: false // Clear selections
    }));
    this.setData({
      messages: resetMessages,
      batchDeleteMode: false
    });
  }
});