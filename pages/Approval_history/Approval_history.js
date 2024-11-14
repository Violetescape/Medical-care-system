Page({
    data: {
      approvedRequests: [], // 存储审批通过的报销申请列表（status = 2）
      rejectedRequests: [], // 存储审批不通过的报销申请列表（status = 3）
    },
  
    onLoad: function() {
      this.fetchApprovalHistory();
    },
  
    fetchApprovalHistory: function() {
      const db = wx.cloud.database();
      const queryApproved = db.collection('Reimbursement_Requests').where({
        status: 3
      });
      const queryRejected = db.collection('Reimbursement_Requests').where({
        status: 2
      });
  
      Promise.all([queryApproved.get(), queryRejected.get()])
        .then(res => {
          this.setData({
            approvedRequests: res[0].data, // 审批通过的请求
            rejectedRequests: res[1].data // 审批不通过的请求
          });
        })
        .catch(err => {
          console.error(err);
          wx.showToast({
            title: '获取审批历史失败',
            icon: 'none'
          });
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