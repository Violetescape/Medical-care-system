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
  
    // 审批通过处理函数
    approveRequest: function() {
      const db = wx.cloud.database();
      db.collection('Reimbursement_Requests').doc(this.data.requestId).update({
        data: {
          status: 3 // 审批通过
        },
        success: res => {
          console.log('审批通过成功');
          wx.showToast({
            title: '审批通过',
            icon: 'success'
          });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '审批失败，请重试',
            icon: 'none'
          });
        }
      });
    },
  
    // 审批不通过处理函数
    rejectRequest: function() {
      const db = wx.cloud.database();
      db.collection('Reimbursement_Requests').doc(this.data.requestId).update({
        data: {
          status: 2 // 审批不通过
        },
        success: res => {
          console.log('审批不通过成功');
          wx.showToast({
            title: '审批不通过',
            icon: 'success'
          });
        },
        fail: err => {
          console.error(err);
          wx.showToast({
            title: '审批失败，请重试',
            icon: 'none'
          });
        }
      });
    }
  });