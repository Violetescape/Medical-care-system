Page({
    data: {
      childName: '', // 存储孩子姓名
      childID: '' // 存储孩子身份证号
    },
  
    // 绑定孩子姓名输入
    bindNameInput(e) {
      this.setData({
        childName: e.detail.value
      });
    },
  
    // 绑定孩子身份证号输入
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
  
      // 获取全局变量中的职工 _id
      const app = getApp();
      const currentEmployeeId = app.globalData.currentEmployeeId;
  
      if (!currentEmployeeId) {
        wx.showToast({
          title: '未找到职工信息',
          icon: 'none'
        });
        return;
      }
  
      // 获取数据库实例
      const db = wx.cloud.database();
      const familyCollection = db.collection('Family');
  
      const familyData = {
        children_name: this.data.childName,
        sfz: this.data.childID,
        parent_id: currentEmployeeId // 使用全局变量中的职工 _id
      };
  
      // 添加 Family 集合中的记录
      familyCollection.add({
        data: familyData,
        success: (resAdd) => {
          console.log('添加用户信息成功', resAdd);
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
          console.error('添加用户信息失败', err);
          wx.showToast({
            title: '绑定失败，请重试',
            icon: 'none'
          });
        }
      });
    }
  });