// pages/Apply_review/Apply_review.js
Page({
    data: {
      requests: [], // 存储报销申请列表
    },
  
    onLoad: function() {
      this.fetchReimbursementRequests();
    },
  
    fetchReimbursementRequests: function() {
      const db = wx.cloud.database();
      db.collection('Reimbursement_Requests').get({
        success: res => {
          this.setData({ requests: res.data });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '获取报销申请失败',
            icon: 'none'
          });
        }
      });
    },
  
    // 查看单个报销申请详情
    viewRequestDetails: function(e) {
      const requestId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/Request_detail/Request_detail?id=${requestId}` // 假设您有一个名为Request_detail的页面用于显示详情
      });
    }
  });