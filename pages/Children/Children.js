Page({
    data: {
      childName: '', // 存储姓名
      childID: '' // 存储身份证号
    },
  
    // 绑定姓名输入
    bindNameInput(e) {
      this.setData({
        childName: e.detail.value
      });
    },
  
    // 绑定身份证号输入
    bindIDInput(e) {
      this.setData({
        childID: e.detail.value
      });
    },
  
    // 提交信息
    submitInfo() {
      if (this.data.childName.trim() === '' || this.data.childID.trim() === '') {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }
  
      // 获取全局变量中的新记录 _id
      const app = getApp();
      const newRecordId = app.globalData.newRecordId;
  
      console.log('Global newRecordId:', newRecordId); // 调试输出
  
      if (!newRecordId) {
        wx.showToast({
          title: '未找到职工信息',
          icon: 'none'
        });
        return;
      }
  
      // 获取数据库实例
      const db = wx.cloud.database();
      const userCollection = db.collection('users'); // 选择 user 集合
  
      // 更新记录，添加 children 字段
      userCollection.doc(newRecordId).update({
        data: {
          children: this.data.childName // 将 children 设置为输入的姓名
        },
        success: (res) => {
          console.log('更新用户信息成功', res);
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          });
  
          // 清空输入
          this.setData({
            childName: '',
            childID: ''
          });
        },
        fail: (err) => {
          console.error('更新用户信息失败', err);
          wx.showToast({
            title: '绑定失败，请重试',
            icon: 'none'
          });
        }
      });
    }
  });