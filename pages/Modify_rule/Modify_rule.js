// pages/Modify_rule/index.js
Page({
    data: {
      currentRules: '', // 用来存储从数据库获取的当前报销规则
      newAmountReimbursement: '', // 用户输入的新报销额度
      newExcessReimbursementRatio: '', // 用户输入的新报销百分比
    },
  
    onLoad: function() {
      this.fetchReimbursementRules();
    },
  
    fetchReimbursementRules: function() {
      const db = wx.cloud.database();
      db.collection('Reimbursement_rules').doc('7f296b216735a649011d91ab6cba44a8').get({
        success: res => {
          const { Amount_reimbursement, Excess_reimbursement_ratio } = res.data;
          this.setData({
            currentRules: `当前的规则为${Amount_reimbursement}元以下全部报销，超额的部分报销${Excess_reimbursement_ratio}%`,
            newAmountReimbursement: Amount_reimbursement, // 初始化输入框为当前值
            newExcessReimbursementRatio: Excess_reimbursement_ratio, // 初始化输入框为当前值
          });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '获取规则失败',
            icon: 'none'
          });
        }
      });
    },
  
    updateNewAmountReimbursement: function(e) {
      this.setData({ newAmountReimbursement: e.detail.value });
    },
  
    updateNewExcessReimbursementRatio: function(e) {
      this.setData({ newExcessReimbursementRatio: e.detail.value });
    },
  
    // 更新报销规则
    updateReimbursementRules: function() {
      const db = wx.cloud.database();
      const newRules = {
        Amount_reimbursement: this.data.newAmountReimbursement,
        Excess_reimbursement_ratio: this.data.newExcessReimbursementRatio,
      };
      db.collection('Reimbursement_rules').doc('7f296b216735a649011d91ab6cba44a8').update({
        data: newRules,
        success: res => {
          console.log('规则更新成功');
          wx.showToast({
            title: '规则更新成功',
            icon: 'success'
          });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '规则更新失败',
            icon: 'none'
          });
        }
      });
    }
  });