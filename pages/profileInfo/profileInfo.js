Page({
  data: {
    avatarUrl: '/images/0.png',  // 默认头像
  },

  // 头像选择事件
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl  // 更新头像
    });

    // 获取本地存储的 userInfo
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 获取当前用户的 openid
      const openid = userInfo.openid;

      // 获取数据库实例
      const db = wx.cloud.database();
      const userCollection = db.collection('users'); // 选择 users 集合

      // 更新用户信息
      userCollection.where({
        openid: openid  // 根据 openid 查找用户
      }).update({
        data: {
          avatarUrl: avatarUrl  // 更新头像 URL
        },
        success: (res) => {
          wx.showToast({
            title: '头像更新成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          console.error('头像更新失败', err);
          wx.showToast({
            title: '头像更新失败，请重试',
            icon: 'none'
          });
        }
      });
    }
  }
});
