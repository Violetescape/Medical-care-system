Page({
    data: {
      pendingRequests: [], // 存储待审批的报销申请列表（status = 1）
    },
  
    onLoad: function() {
      this.fetchPendingReimbursementRequests();
    },
  
    fetchPendingReimbursementRequests: function() {
      const db = wx.cloud.database();
      db.collection('Reimbursement_Requests').where({
        status: 1 // 只查询待审批的申请，即status为1的记录
      }).get({
        success: res => {
          this.setData({ pendingRequests: res.data });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '获取待审批报销申请失败',
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