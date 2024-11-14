Page({
    data: {
      account: '',
      password: '',
      showLogin: true, // 控制是否显示登录界面
      showOperationButtons: false, // 控制是否显示操作按钮
    },
  
    // 账号输入
    inputAccount: function(e) {
      this.setData({
        account: e.detail.value
      });
    },
  
    // 密码输入
    inputPassword: function(e) {
      this.setData({
        password: e.detail.value
      });
    },
  
    // 登录验证
    login: function() {
      const db = wx.cloud.database();
      db.collection('Administrators').where({
        account: this.data.account,
        password: this.data.password
      }).get({
        success: res => {
          if (res.data.length > 0) {
            console.log('登录成功');
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            this.setData({ 
              showLogin: false, // 隐藏登录界面
              showOperationButtons: true // 显示操作按钮
            }); 
          } else {
            wx.showToast({
              title: '账号或密码错误',
              icon: 'none'
            });
          }
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      });
    },
  
    // 修改报销规则
    modifyReimbursementRules: function() {
      wx.navigateTo({
        url: '/pages/Modify_rule/Modify_rule' // 跳转到Modify_rule页面
      });
    },
  
    // 报销申请审批
    approveReimbursement: function() {
      wx.navigateTo({
        url: '/pages/Apply_review/Apply_review' // 跳转到Apply_review页面
      });
    },
  
    // 报销记录
    viewApprovalHistory: function() {
      wx.navigateTo({
        url: '/pages/Approval_history/Approval_history' // 跳转到Approval_history页面
      });
    }
  });