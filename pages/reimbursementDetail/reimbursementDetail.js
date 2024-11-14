Page({
    data: {
      reimbursement: null,
      reimbursementStatus: 0, // 用于表示报销的当前状态
      remainingAmount: '' // 用于显示报销后还需支付的金额
    },
  
    onLoad(options) {
      const { queryId } = options;
      if (queryId) {
        this.fetchReimbursementDetail(queryId);
      }
    },
  
    // 获取报销详情数据
    fetchReimbursementDetail(queryId) {
      const db = wx.cloud.database();
      db.collection('Reimbursement_Requests').doc(queryId).get()
        .then(res => {
          if (res.data) {
            this.setData({
              reimbursement: res.data,
              reimbursementStatus: res.data.status, // status 为1-3分别表示流程的状态
              remainingAmount: res.data.status === 3 ? `还需支付${res.data.Reimbursement_amount}元` : '' // 当状态为3时，设置剩余金额信息
            });
          } else {
            wx.showToast({
              title: "未找到该报销记录",
              icon: "none"
            });
          }
        })
        .catch(err => {
          wx.showToast({
            title: "查询失败，请稍后重试",
            icon: "none"
          });
          console.error('获取报销详情失败', err);
        });
    }
  });