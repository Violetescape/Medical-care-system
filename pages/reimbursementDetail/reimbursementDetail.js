Page({
  data: {
    reimbursement: null // 存储报销的详细信息
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
          this.setData({ reimbursement: res.data });
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
