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
  
      // 获取云开发数据库的引用
      const db = wx.cloud.database();
  
      // 准备要添加的数据
      const dataToAdd = {
        amount: this.data.amount,
        date: this.data.date,
        note: this.data.note,
        employeeId: this.data.employeeId,
        name: this.data.name,
        department: this.data.department,
        expenseType: this.data.expenseType
      };
  
      // 调用 add 方法添加数据
      db.collection('Reimbursement_Requests').add({
        data: dataToAdd,
        success: (res) => {
          // 添加成功的处理
          wx.showToast({
            title: "申请已提交",
            icon: "success"
          });
          this.setData({
            amount: "",
            date: "",
            note: "",
            employeeId: "",
            name: "",
            department: "",
            expenseType: ""
          });
        },
        fail: (err) => {
          // 添加失败的处理
          wx.showToast({
            title: "提交失败",
            icon: "none"
          });
          console.error('添加记录失败', err);
        }
      });
    }
  });