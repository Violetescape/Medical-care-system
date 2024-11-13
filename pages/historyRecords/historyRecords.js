Page({
  data: {
    allRecords: [],
    filteredRecords: [],
    expenseTypeOptions: ["全部", "校内就诊", "校外就诊"], // 报销类型选项
    expenseTypeIndex: 0,
    statusOptions: ["全部", "待审核", "审核通过", "审核拒绝"], // 报销状态选项
    statusIndex: 0
  },

  onLoad() {
    this.fetchAllRecords();
  },

  fetchAllRecords() {
    const db = wx.cloud.database();
    db.collection('Reimbursement_Requests')
      .where({ _openid: wx.getStorageSync('openid') }) // 获取当前用户的记录
      .get()
      .then(res => {
        this.setData({ 
          allRecords: res.data,
          filteredRecords: res.data 
        });
      })
      .catch(err => {
        wx.showToast({
          title: "获取记录失败",
          icon: "none"
        });
        console.error('获取历史记录失败', err);
      });
  },

  // 筛选条件变更的处理函数
  onExpenseTypeChange(e) {
    this.setData({ expenseTypeIndex: e.detail.value }, this.applyFilters);
  },

  onStatusChange(e) {
    this.setData({ statusIndex: e.detail.value }, this.applyFilters);
  },

  applyFilters() {
    const { allRecords, expenseTypeIndex, expenseTypeOptions, statusIndex } = this.data;
    let filtered = allRecords;
  
    // 按报销类型筛选
    if (expenseTypeIndex > 0) {
      const expenseType = expenseTypeOptions[expenseTypeIndex];
      filtered = filtered.filter(record => record.expenseType === expenseType);
    }
  
    // 按状态筛选，转换为浮点数以匹配数据库中的状态值
    if (statusIndex > 0) {
      const status = parseFloat(statusIndex); // 将状态索引转换为浮点数
      filtered = filtered.filter(record => record.status === status);
    }
  
    console.log("筛选结果:", filtered); // 打印筛选结果
    this.setData({ filteredRecords: filtered });
  }  
});
