// pages/Request_detail/Request_detail.js
Page({
    data: {
      requestId: '',
      requestDetails: {}, // 存储单个报销申请的详细信息
    },
  
    onLoad: function(options) {
      this.setData({ requestId: options.id });
      this.fetchReimbursementRequestDetails();
    },
  
    fetchReimbursementRequestDetails: function() {
      const db = wx.cloud.database();
      db.collection('Reimbursement_Requests').doc(this.data.requestId).get({
        success: res => {
          this.setData({ requestDetails: res.data });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '获取报销申请详情失败',
            icon: 'none'
          });
        }
      });
    },
  });