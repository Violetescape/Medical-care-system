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
      // 获取当前用户的userInfo对象
      const userInfo = wx.getStorageSync('userInfo');
      // 从userInfo对象中提取openid
      const openid = userInfo ? userInfo.openid : null;
      console.log("Stored openid:", openid); // 打印存储的openid，检查是否为空或正确
  
      if (!openid) {
        wx.showToast({
          title: "用户未登录",
          icon: "none"
        });
        return;
      }
      // 再次打印_openid，确保查询使用的是正确的openid
      console.log("Using _openid for query:", openid);
  
      db.collection('Reimbursement_Requests')
        .where({ _openid: openid }) // 使用openid查询
        .get()
        .then(res => {
          if (res.data.length === 0) {
            wx.showToast({
              title: "没有报销记录",
              icon: "none"
            });
          }
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
  
      // 按状态筛选
      if (statusIndex > 0) {
        const status = statusIndex; // 直接使用状态索引
        filtered = filtered.filter(record => record.status.toString() === status);
      }
  
      console.log("筛选结果:", filtered); // 打印筛选结果
      this.setData({ filteredRecords: filtered });
    }  
  });