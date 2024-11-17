Page({
    data: {
      currentEmployeeRules: '', // 用来存储从数据库获取的当前职工保险规则
      currentChildrenRules: '', // 用来存储从数据库获取的当前子女报销规则
      newEmployeeAmountReimbursement: '', // 用户输入的新职工报销额度
      newEmployeeExcessReimbursementRatio: '', // 用户输入的新职工报销百分比
      newChildrenAmountReimbursement: '', // 用户输入的新子女报销额度
      newChildrenExcessReimbursementRatio: '', // 用户输入的新子女报销百分比
    },
  
    onLoad: function() {
      this.fetchReimbursementRules();
    },
  
    fetchReimbursementRules: function() {
      const db = wx.cloud.database();
      // 获取职工保险规则
      db.collection('Reimbursement_rules').doc('7f296b216735a649011d91ab6cba44a8').get({
        success: res => {
          const { Amount_reimbursement: employeeAmount, Excess_reimbursement_ratio: employeeRatio } = res.data;
          this.setData({
            currentEmployeeRules: `当前职工保险规则为${employeeAmount}元以下全部报销，超额的部分报销${employeeRatio}%`,
            newEmployeeAmountReimbursement: employeeAmount, // 初始化输入框为当前值
            newEmployeeExcessReimbursementRatio: employeeRatio, // 初始化输入框为当前值
          });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '获取职工保险规则失败',
            icon: 'none'
          });
        }
      });
  
      // 获取子女报销规则
      db.collection('Reimbursement_rules').doc('7f296b216735a649011d91ab6cba44a8').get({
        success: res => {
          const { Children_amount: childrenAmount, Children_ratio: childrenRatio } = res.data;
          this.setData({
            currentChildrenRules: `当前子女报销规则为${childrenAmount}元以下全部报销，超额的部分报销${childrenRatio}%`,
            newChildrenAmountReimbursement: childrenAmount, // 初始化输入框为当前值
            newChildrenExcessReimbursementRatio: childrenRatio, // 初始化输入框为当前值
          });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '获取子女报销规则失败',
            icon: 'none'
          });
        }
      });
    },
  
    updateNewEmployeeAmountReimbursement: function(e) {
      this.setData({ newEmployeeAmountReimbursement: e.detail.value });
    },
  
    updateNewEmployeeExcessReimbursementRatio: function(e) {
      this.setData({ newEmployeeExcessReimbursementRatio: e.detail.value });
    },
  
    updateNewChildrenAmountReimbursement: function(e) {
      this.setData({ newChildrenAmountReimbursement: e.detail.value });
    },
  
    updateNewChildrenExcessReimbursementRatio: function(e) {
      this.setData({ newChildrenExcessReimbursementRatio: e.detail.value });
    },
  
    // 更新报销规则
    updateReimbursementRules: function() {
      const db = wx.cloud.database();
      // 更新职工保险规则
      db.collection('Reimbursement_rules').doc('7f296b216735a649011d91ab6cba44a8').update({
        data: {
          Amount_reimbursement: this.data.newEmployeeAmountReimbursement,
          Excess_reimbursement_ratio: this.data.newEmployeeExcessReimbursementRatio,
        },
        success: res => {
          console.log('职工保险规则更新成功');
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '职工保险规则更新失败',
            icon: 'none'
          });
        }
      });
  
      // 更新子女报销规则
      db.collection('Reimbursement_rules').doc('7f296b216735a649011d91ab6cba44a8').update({
        data: {
          Children_amount: this.data.newChildrenAmountReimbursement,
          Children_ratio: this.data.newChildrenExcessReimbursementRatio,
        },
        success: res => {
          console.log('子女报销规则更新成功');
          wx.showToast({
            title: '所有规则更新成功',
            icon: 'success'
          });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '子女报销规则更新失败',
            icon: 'none'
          });
        }
      });
    }
  });