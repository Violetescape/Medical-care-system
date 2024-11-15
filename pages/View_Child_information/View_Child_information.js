const db = wx.cloud.database(); // 获取云开发数据库实例
const familyCollection = db.collection('Family'); // 假设子女数据在 'Family' 集合中

Page({
  data: {
    childrenInfo: [] // 存储查询到的子女信息
  },

  onLoad: function () {
    this.fetchChildrenInfo();
  },

  // 查询子女信息
  fetchChildrenInfo: function () {
    const app = getApp();
    const currentEmployeeId = app.globalData.currentEmployeeId;

    if (!currentEmployeeId) {
      wx.showToast({
        title: '职工信息未找到',
        icon: 'none'
      });
      return;
    }

    familyCollection.where({
      parent_id: currentEmployeeId
    }).get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            childrenInfo: res.data
          });
        } else {
          wx.showToast({
            title: '没有找到子女信息',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('查询子女信息失败', err);
        wx.showToast({
          title: '查询失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到子女信息页面
  goToChildrenPage: function () {
    wx.navigateTo({
      url: '/pages/Children/Children'
    });
  }
});