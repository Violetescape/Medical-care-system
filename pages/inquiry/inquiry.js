Page({
  data: {
    queryId: "",
    reimbursement: null,
    statusMessage: ""
  },

  onQueryIdChange(event) {
    this.setData({ queryId: event.detail.value });
  },

  queryReimbursement() {
    const queryId = this.data.queryId.trim();
    if (!queryId) {
      wx.showToast({
        title: "请输入查询 ID",
        icon: "none"
      });
      return;
    }

    const db = wx.cloud.database();
    db.collection('Reimbursement_Requests').doc(queryId).get()
      .then(res => {
        if (res.data) {
          // 查询成功后清空数据并跳转到报销详情页面
          this.setData({ reimbursement: null, statusMessage: "" });
          wx.navigateTo({
            url: `/pages/reimbursementDetail/reimbursementDetail?queryId=${queryId}`
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
          title: "查询失败，请检查 ID 是否正确",
          icon: "none"
        });
        console.error('查询报销记录失败', err);
      });
  }
});
