const db = wx.cloud.database(); // 获取云开发数据库实例
const userCollection = db.collection('users'); // 假设用户数据在 'users' 集合中

Page({
  data: {
    userName: '', // 用户名
    avatarUrl: '/images/0.png', // 默认头像
    userInfo: null, // 存储用户信息
    isLoggedIn: false, // 用于判断是否登录
    department: '' // 存储职工部门
  },

  onLoad: function () {
    // 页面加载时，检查本地存储是否有用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.openid) {
      // 从数据库中获取 userName 和 department 信息
      userCollection.where({ openid: userInfo.openid }).get().then(res => {
        if (res.data.length > 0) {
          const userData = res.data[0];
          // 如果数据库中有信息，更新页面数据
          this.setData({
            userName: userData.userName || '默认昵称',
            department: userData.department || '未设置部门',
            avatarUrl: userInfo.avatarUrl || '/images/0.png', // 保留本地的头像 URL
            userInfo: userInfo,
            isLoggedIn: true
          });
        } else {
          console.error('用户记录不存在');
        }
      }).catch(err => {
        console.error('查询用户信息失败', err);
        wx.showToast({
          title: '查询失败，请重试',
          icon: 'none'
        });
      });
    }
  },

  // 用户选择头像的处理函数
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl // 更新头像 URL
    });

    // 更新本地存储中的用户信息
    const userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.avatarUrl = avatarUrl;
    wx.setStorageSync('userInfo', userInfo);

    // 上传头像 URL 到云数据库
    const openid = userInfo.openid; // 假设 userInfo 中有 openid 字段
    if (openid) {
      userCollection.where({ openid }).get().then(res => {
        if (res.data.length > 0) {
          // 更新数据库中的头像 URL
          userCollection.doc(res.data[0]._id).update({
            data: {
              avatarUrl: avatarUrl // 更新数据库中的头像 URL
            },
            success: () => {
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
        } else {
          console.error('用户记录不存在');
        }
      }).catch(err => {
        console.error('查询用户信息失败', err);
        wx.showToast({
          title: '查询失败，请重试',
          icon: 'none'
        });
      });
    } else {
      console.error('未找到 openid');
      wx.showToast({
        title: '用户未登录',
        icon: 'none'
      });
    }
  },

  // 其他功能代码保持不变...

  viewSettings() {
    wx.navigateTo({
      url: "/pages/settings/settings"
    });
  },

  navigateToHistory() {
    wx.navigateTo({
      url: "/pages/historyRecords/historyRecords"
    });
  },

  logout() {
    wx.showModal({
      title: "确认退出",
      content: "您确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: "已退出",
            icon: "success"
          });

          // 清除本地存储中的用户信息
          wx.removeStorageSync('userInfo');

          // 清空页面上的用户信息
          this.setData({
            userName: '',
            avatarUrl: '/images/0.png', // 退出后重置为默认头像
            userInfo: null,
            isLoggedIn: false,  // 更新为未登录状态
            department: ''  // 清空部门信息
          });

          // 导航回首页或登录页面
          wx.reLaunch({
            url: '/pages/home/home'  // 修改为你希望跳转的页面
          });
        }
      }
    });
  },

  navigateToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'  // 修改为你的登录页面路径
    });
  },

  bindEmployeeInfo() {
    wx.navigateTo({
      url: '/pages/bindInfo/bindInfo'  // 绑定职工信息页面路径
    });
  }
});
