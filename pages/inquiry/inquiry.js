Page({
  data: {
    queryId: "",        // 用户输入的查询 ID
    reimbursement: null, // 查询到的报销申请信息
    statusMessage: ""    // 显示的状态信息
  },

  // 监听查询 ID 输入变化
  onQueryIdChange(event) {
    this.setData({ queryId: event.detail.value });
  },

  // 查询报销申请
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
          const reimbursement = res.data;
          const statusMessages = {
            "submitted": "已提交，等待审核",
            "in_review": "审核中",
            "approved": "申请已批准",
            "rejected": "申请已拒绝"
          };
          const statusMessage = statusMessages[reimbursement.status] || "未知状态";
          this.setData({ reimbursement, statusMessage });
        } else {
          wx.showToast({
            title: "未找到该报销申请",
            icon: "none"
          });
          this.setData({ reimbursement: null, statusMessage: "" });
        }
      })
      .catch(err => {
        wx.showToast({
          title: "查询失败，请检查 ID 是否正确",
          icon: "none"
        });
        console.error('查询报销申请失败', err);
        this.setData({ reimbursement: null, statusMessage: "" });
      });
  }
});
