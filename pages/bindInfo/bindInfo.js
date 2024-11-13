Page({
  data: {
    employeeId: '', // 职工号
    userName: '',    // 姓名
    department: '',  // 部门
  },

  // 页面加载时，获取用户信息
  onLoad: function () {
    // 获取本地存储的 userInfo
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 将用户信息显示在页面上
      this.setData({
        employeeId: userInfo.employeeId || '',
        userName: userInfo.userName || '',
        department: userInfo.department || ''
      });
    }
  },

  // 用户点击提交按钮时的处理函数
  bindUserInfo: function () {
    const { employeeId, userName, department } = this.data;

    // 检查输入的职工号、姓名和部门是否完整
    if (!employeeId || !userName || !department) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 获取本地存储中的用户信息
    const userInfo = wx.getStorageSync('userInfo');

    if (!userInfo) {
      wx.showToast({
        title: '未找到用户信息，请重新登录',
        icon: 'none'
      });
      return;
    }

    // 获取数据库实例
    const db = wx.cloud.database();
    const userCollection = db.collection('users'); // 选择 user 集合

    // 检查数据库中是否已存在该职工号
    userCollection.where({
      employeeId: employeeId
    }).get({
      success: (res) => {
        if (res.data.length > 0) {
          // 如果职工号已存在，更新信息
          userCollection.doc(res.data[0]._id).update({
            data: {
              userName: userName,
              department: department,
              bindTime: new Date()  // 记录更新时间
            },
            success: () => {
              console.log('用户信息更新成功');

              // 保存绑定信息到本地存储
              wx.setStorageSync('userInfo', {
                employeeId: employeeId,
                userName: userName,
                department: department
              });

              // 提示保存成功
              wx.showToast({
                title: '信息更新成功',
                icon: 'success'
              });

              // 跳转回主页面
              wx.reLaunch({
                url: '/pages/home/home'  // 修改为主页面的路径
              });
            },
            fail: (err) => {
              console.error('更新用户信息失败', err);
              wx.showToast({
                title: '更新失败，请重试',
                icon: 'none'
              });
            }
          });
        } else {
          // 如果职工号不存在，新增记录
          userCollection.add({
            data: {
              employeeId: employeeId,
              userName: userName,
              department: department,
              bindTime: new Date()  // 记录绑定时间
            },
            success: (res) => {
              console.log('用户信息保存成功', res);

              // 保存绑定信息到本地存储
              wx.setStorageSync('userInfo', {
                employeeId: employeeId,
                userName: userName,
                department: department
              });

              // 提示保存成功
              wx.showToast({
                title: '信息绑定成功',
                icon: 'success'
              });

              // 跳转回主页面
              wx.reLaunch({
                url: '/pages/home/home'  // 修改为主页面的路径
              });
            },
            fail: (err) => {
              console.error('保存用户信息失败', err);
              wx.showToast({
                title: '保存失败，请重试',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: (err) => {
        console.error('查询用户信息失败', err);
        wx.showToast({
          title: '查询失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 更新职工号的输入
  onEmployeeIdChange: function (e) {
    this.setData({
      employeeId: e.detail.value
    });
  },

  // 更新姓名的输入
  onUserNameChange: function (e) {
    this.setData({
      userName: e.detail.value
    });
  },

  // 更新部门的输入
  onDepartmentChange: function (e) {
    this.setData({
      department: e.detail.value
    });
  }
});
