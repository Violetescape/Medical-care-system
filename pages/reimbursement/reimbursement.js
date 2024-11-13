Page({
  data: {
    amount: "",
    date: "",
    note: "",
    employeeId: "",
    name: "",
    department: "",
    expenseType: "", // 费用类型
    expenseTypeOptions: ['校内就诊', '校外就诊'] // 费用类型选项
  },

  onAmountChange(event) {
    this.setData({ amount: event.detail.value });
  },

  onDateChange(event) {
    this.setData({ date: event.detail.value });
  },

  onNoteChange(event) {
    this.setData({ note: event.detail.value });
  },

  onEmployeeIdChange(event) {
    this.setData({ employeeId: event.detail.value });
  },

  onNameChange(event) {
    this.setData({ name: event.detail.value });
  },

  onDepartmentChange(event) {
    this.setData({ department: event.detail.value });
  },

  onExpenseTypeChange(event) {
    this.setData({ expenseType: this.data.expenseTypeOptions[event.detail.value] });
  },

  submitApplication() {
    if (!this.data.amount || !this.data.date || !this.data.employeeId || !this.data.name || !this.data.department || !this.data.expenseType) {
      wx.showToast({
        title: "请填写所有必填项",
        icon: "none"
      });
      return;
    }

    const db = wx.cloud.database();
    const dataToAdd = {
      amount: this.data.amount,
      date: this.data.date,
      note: this.data.note,
      employeeId: this.data.employeeId,
      name: this.data.name,
      department: this.data.department,
      expenseType: this.data.expenseType,
      status: 1 // 状态字段，1表示“待审核”
    };

    db.collection('Reimbursement_Requests').add({
      data: dataToAdd,
      success: (res) => {
        const reimbursementId = res._id; // 获取提交后的报销申请 ID
        wx.showToast({
          title: "申请已提交",
          icon: "success"
        });

        // 清空表单数据
        this.setData({
          amount: "",
          date: "",
          note: "",
          employeeId: "",
          name: "",
          department: "",
          expenseType: ""
        });

        // 生成消息通知用户
        this.createMessage(reimbursementId);
      },
      fail: (err) => {
        wx.showToast({
          title: "提交失败",
          icon: "none"
        });
        console.error('添加记录失败', err);
      }
    });
  },

  // 创建消息通知用户查询 ID
  createMessage(reimbursementId) {
    const db = wx.cloud.database();
    const messageData = {
      text: `您的报销申请已提交成功，查询 ID 为：${reimbursementId}，当前状态：待审核`,
      timestamp: Date.now()
    };

    db.collection('Messages').add({
      data: messageData,
      success: () => {
        console.log('消息已成功添加');
      },
      fail: (err) => {
        console.error('消息添加失败', err);
      }
    });
  }
});
